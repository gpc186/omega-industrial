import { api } from "/js/api.js"

const tabelaProdutos = document.getElementById("tabelaProdutos");
const selectCategoria = document.getElementById("selectCategoria");
const modalEdicao = document.getElementById("modalEdicao");

async function carregarCategorias(selectElement) {
    const tabela = document.getElementById("listaCategorias");
    const res = await api.listarCategorias();

    selectElement.innerHTML = "";

    res.categorias.forEach(cat => {
        const op = document.createElement("option");
        op.value = cat.id;
        op.textContent = cat.nome;
        selectElement.appendChild(op);
    });
    
    tabela.innerHTML = "";
    res.categorias.forEach(cat => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${cat.id}</td>
                <td>${cat.nome}</td>
                <td>${cat.description || ""}</td>
                <td>
                    <button data-id="${cat.id}" class="btnExcluir btn-del-cat">Excluir</button>
                </td>
            `;
        tabela.appendChild(tr);
    });
}

async function carregarProdutos() {

    const res = await api.listarProdutos();
    const produtos = res.produtos;

    tabelaProdutos.innerHTML = "";

    produtos.forEach(prod => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${(JSON.parse(prod.img_urls || "[]"))
                .map(url => `<img src="${url}" width="60">`)
                .join("")}
            </td>
            <td>${prod.nome}</td>
            <td>${prod.categoria_nome}</td>
            <td>R$ ${prod.preco}</td>
            <td>${prod.quantidade}</td>
            <td class="actions">
        <button class="btnEditar" data-id="${prod.id}">Editar</button>
        <button class="btnExcluir" data-id="${prod.id}">Excluir</button>
    </td>
`;


        tabelaProdutos.appendChild(tr);
    });
}

document.getElementById("formCriarProduto").addEventListener("submit", async e => {
    e.preventDefault();

    const images = document.getElementById("imagesCriar").files;
    if (images.length !== 2) {
        return alert("Envie exatamente 2 imagens!");
    }

    const form = new FormData(e.target);

    const res = await api.criarProduto(form);

    if (res.ok) {
        alert("Produto criado!");
        e.target.reset();
        carregarProdutos();
    } else {
        alert(res.error || res.message || "Erro ao criar produto.");
    }
});

tabelaProdutos.addEventListener("click", async e => {

    if (e.target.classList.contains("btnEditar")) {
        const id = e.target.dataset.id;

        const res = await api.buscarProduto(id);
        const p = res.produto;

        document.getElementById("edit_id").value = p.id;
        document.getElementById("edit_nome").value = p.nome;
        document.getElementById("edit_preco").value = p.preco;
        document.getElementById("edit_quantidade").value = p.quantidade;
        document.getElementById("edit_descricao").value = p.descricao;

        await carregarCategorias(document.getElementById("edit_categoria"));
        document.getElementById("edit_categoria").value = p.category_id;

        const previewDiv = document.getElementById("edit_preview");
        previewDiv.innerHTML = "";

        JSON.parse(p.img_urls || "[]").forEach(img => {
            const tag = document.createElement("img");
            tag.src = img;
            tag.width = 80;
            previewDiv.appendChild(tag);
        });

        modalEdicao.style.display = "block";
    }

    if (e.target.classList.contains("btnExcluir")) {
        const id = e.target.dataset.id;

        if (!confirm("Excluir este produto?")) return;

        const res = await api.deletarProduto(id);

        if (res.ok) {
            alert("Produto removido!");
            carregarProdutos();
        } else {
            alert(res.error);
        }
    }
});

document.getElementById("formEditarProduto").addEventListener("submit", async e => {
    e.preventDefault();

    const id = document.getElementById("edit_id").value;

    const form = new FormData(e.target);

    const res = await api.atualizarProduto(id, form);

    if (res.ok) {
        alert("Produto atualizado!");
        modalEdicao.style.display = "none";
        carregarProdutos();
    } else {
        alert(res.error || "Erro ao atualizar produto");
    }
});

function fecharModal() {
    modalEdicao.style.display = "none";
}

// ========================================================
// INICIALIZAÇÃO
// ========================================================
carregarCategorias(selectCategoria);
carregarProdutos();

/* ===========================================
   EVENTO DE EXCLUSÃO DE CATEGORIA
   =========================================== */
document.getElementById("listaCategorias").addEventListener("click", async e => {
    if (!e.target.classList.contains("btn-del-cat")) return;

    const id = e.target.dataset.id;

    if (!confirm("Excluir esta categoria?")) return;

    const res = await api.deletarCategoria(id);

    if (res.ok) {
        alert("Categoria removida!");
        carregarCategorias(selectCategoria); // recarrega a tabela e o select
    } else {
        alert(res.error || "Erro ao excluir categoria");
    }
});