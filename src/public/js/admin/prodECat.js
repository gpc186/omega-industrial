import { api } from "/js/api.js";

const tabelaProdutos = document.getElementById("tabelaProdutos");
const tabela = document.getElementById("listaCategorias");
const selectCategoria = document.getElementById("selectCategoria");
const modalEdicao = document.getElementById("modalEdicao");

async function carregarCategorias() {
    const res = await api.listarCategorias();

    selectCategoria.innerHTML = "<option value=''>Selecione</option>";
    res.categorias.forEach(cat => {
        const op = document.createElement("option");
        op.value = cat.id;
        op.textContent = cat.nome;
        selectCategoria.appendChild(op);
    });

    tabela.innerHTML = "";
    res.categorias.forEach(cat => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${cat.id}</td>
                <td>${cat.nome}</td>
                <td>
                    <button data-id="${cat.id}" class="btnExcluir btn-del-cat">Excluir</button>
                </td>
            `;
        tabela.appendChild(tr);
    });
}

document.getElementById("formCategoria").addEventListener("submit", async e => {
    e.preventDefault();

    const nome = document.getElementById("nomeCategoria").value;
    const desc = document.getElementById("descricaoCategoria").value;

    const res = await api.criarCategoria(nome, desc);

    if (res.ok) {
        alert("Categoria criada!");
        e.target.reset();
        carregarCategorias();
    } else {
        alert(res.error || "Erro ao criar categoria.");
    }
});

tabela.addEventListener("click", async e => {
    if (!e.target.classList.contains("btn-del-cat")) return;

    const id = e.target.dataset.id;

    if (!confirm("Excluir categoria?")) return;

    const res = await api.deletarCategoria(id);

    if (res.ok) {
        alert("Categoria removida!");
        carregarCategorias();
    } else {
        alert(res.error || "Erro ao remover categoria.");
    }
});

async function carregarProdutos() {
    const res = await api.listarProdutos();
    const produtos = res.produtos;

    tabelaProdutos.innerHTML = "";

    produtos.forEach(prod => {
        const tr = document.createElement("tr");
        
        const imagens = JSON.parse(prod.img_urls) || "[]";

        tr.innerHTML = `
            <td>${prod.id}</td>
            <td>${imagens.map(url => `<img src="${url}" width="60">`).join("")}</td>
            <td>${prod.nome}</td>
            <td>${prod.categoria_nome}</td>
            <td>R$ ${prod.preco}</td>
            <td>${prod.quantidade}</td>
            <td class="actions">
        <button class="btnEditar" data-id="${prod.id}">Editar</button>
        <button class="btnExcluirProd" data-id="${prod.id}">Excluir</button>
    </td>
`;


        tabelaProdutos.appendChild(tr);
    });
}

// Criar produto
document.getElementById("formCriarProduto").addEventListener("submit", async e => {
    e.preventDefault();

    const img1 = document.querySelector("input[name='image1']").files[0];
    const img2 = document.querySelector("input[name='image2']").files[0];

    if (!img1 || !img2) {
        return alert("Envie exatamente 2 imagens!");
    }

    const form = new FormData();
    form.append("nome", document.getElementById("nome").value);
    form.append("category_id", document.getElementById("selectCategoria").value);
    form.append("preco", document.getElementById("preco").value);
    form.append("quantidade", document.getElementById("quantidade").value);
    form.append("descricao", document.getElementById("descricao").value);

    form.append("images", img1);
    form.append("images", img2);

    const res = await api.criarProduto(form);

    if (res.success || res.ok) {
        alert("Produto criado!");
        e.target.reset();
        carregarProdutos();
    } else {
        alert(res.error || "Erro ao criar produto.");
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

        // Preview imagens
        const preview = document.getElementById("edit_preview");
        preview.innerHTML = "";
        JSON.parse(p.image_urls).forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.width = 80;
            preview.appendChild(img);
        });

        modalEdicao.style.display = "flex";
    }

    if (e.target.classList.contains("btnExcluir")) {
        const id = e.target.dataset.id;

        if (!confirm("Excluir este produto?")) return;

        const res = await api.deletarProduto(id);

        if (res.success || res.ok) {

            alert("Produto excluído!");
            carregarProdutos();
        } else {
            alert(res.error || "Erro ao excluir.");
        }
    }
});

document.getElementById("formEditarProduto").addEventListener("submit", async e => {
    e.preventDefault();

    const id = document.getElementById("edit_id").value;

    const form = new FormData();

    form.append("nome", document.getElementById("edit_nome").value);
    form.append("preco", document.getElementById("edit_preco").value);
    form.append("quantidade", document.getElementById("edit_quantidade").value);
    form.append("descricao", document.getElementById("edit_descricao").value);
    form.append("category_id", document.getElementById("edit_categoria").value);

    const img1 = document.querySelector("input[name='image1']").files[0];
    const img2 = document.querySelector("input[name='image2']").files[0];

    if (img1 && img2) {
        form.append("images", img1);
        form.append("images", img2);
    }

    const res = await api.atualizarProduto(id, form);

    if (res.ok) {
        alert("Produto atualizado!");
        modalEdicao.style.display = "none";
        carregarProdutos();
    } else {
        alert(res.error || "Erro ao atualizar produto.");
    }
});

window.fecharModal = function () {
    modalEdicao.style.display = "none";
};

carregarCategorias();
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