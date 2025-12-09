import { calcularFrete } from "/js/utils/frete.js";
const API_URL = 'http://localhost:4000/api';

// Funções auxiliares
function getToken() {
    return localStorage.getItem('token');
}

function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    };
}

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    return data;
}

// ==================== FUNÇÕES DO CARRINHO ====================

async function carregarCarrinho() {
    try {
        const token = getToken();

        if (!token) {
            mostrarCarrinhoVazio('Faça login para ver seu carrinho');
            return;
        }

        // Buscar itens do carrinho
        const response = await fetch(`${API_URL}/cart/list`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await handleResponse(response);
        console.log(data.cart);

        if (!data.cart || data.cart.length === 0) {
            mostrarCarrinhoVazio();
            return;
        }

        renderizarCarrinho(data.cart);
        atualizarTotais();

    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        mostrarCarrinhoVazio('Erro ao carregar o carrinho. Tente novamente.');
    }
}

function mostrarCarrinhoVazio(mensagem = 'Seu carrinho está vazio') {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = `
        <div class="empty-cart">
            <h5>${mensagem}</h5>
            <p>Adicione produtos para continuar comprando</p>
        </div>
    `;

    // Zerar totais
    document.getElementById('subtotal').textContent = 'R$ 0,00';
    document.getElementById('frete').textContent = 'R$ 0,00';
    document.getElementById('total').textContent = 'R$ 0,00';
}

function renderizarCarrinho(items) {
    const cartItems = document.getElementById('cartItems');

    cartItems.innerHTML = items.map(item => `
        <div class="card-item" data-product-id="${item.product_id}">
            <img class="card-item__image" 
                 src="${JSON.parse(item.image_urls)[0]}" 
                 alt="${item.nome}">
            
            <div class="card-item__info">
                <div class="card-item__details">
                    <h6>${item.nome}</h6>
                    <p>${item.descricao || 'Sem descrição'}</p>
                </div>
                
                <div class="card-item__quantity">
                    <button class="removeQuant" data-id="${item.product_id}" data-qnt="${item.quantidade}"">-</button>
                    <input type="number" value="${item.quantidade}" min="1" readonly>
                    <button class="addQuant" data-id="${item.product_id}" data-qnt="${item.quantidade}"">+</button>
                </div>
            </div>
            
            <div class="card-item__actions">
                <div class="card-item__remove">
                    <button class="removeItem" data-id="${item.product_id}" title="Remover item">
                        x
                    </button>
                </div>
                
                <div class="card-item__price">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </div>
            </div>
        </div>
    `).join('');

    cartItems.querySelectorAll(".addQuant").forEach(btn => {
        btn.addEventListener("click", () =>
            aumentarQuantidade(btn.dataset.id, Number(btn.dataset.qnt))
        );
    });

    cartItems.querySelectorAll(".removeQuant").forEach(btn => {
        btn.addEventListener("click", () =>
            diminuirQuantidade(btn.dataset.id, Number(btn.dataset.qnt))
        );
    });

    cartItems.querySelectorAll(".removeItem").forEach(btn => {
        btn.addEventListener("click", () =>
            removerItem(btn.dataset.id)
        );
    });

}

async function aumentarQuantidade(productId, quantidadeAtual) {
    try {
        const novaQuantidade = quantidadeAtual + 1;

        const response = await fetch(`${API_URL}/cart/${productId}/updateCart`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity: novaQuantidade })
        });

        await handleResponse(response);
        await carregarCarrinho();

    } catch (error) {
        console.error('Erro ao aumentar quantidade:', error);
        alert('Erro ao atualizar quantidade. Tente novamente.');
    }
}

async function diminuirQuantidade(productId, quantidadeAtual) {
    try {
        if (quantidadeAtual <= 1) {
            const confirmar = confirm('Deseja remover este item do carrinho?');
            if (confirmar) {
                await removerItem(productId);
            }
            return;
        }

        const novaQuantidade = quantidadeAtual - 1;

        const response = await fetch(`${API_URL}/cart/${productId}/updateCart`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity: novaQuantidade })
        });

        await handleResponse(response);
        await carregarCarrinho();

    } catch (error) {
        console.error('Erro ao diminuir quantidade:', error);
        alert('Erro ao atualizar quantidade. Tente novamente.');
    }
}

async function removerItem(productId) {
    try {
        const response = await fetch(`${API_URL}/cart/${productId}/remove`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        await handleResponse(response);
        await carregarCarrinho();

    } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item. Tente novamente.');
    }
}

async function atualizarTotais() {
    try {
        const response = await fetch(`${API_URL}/cart/total`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        const data = await handleResponse(response);
        const subtotal = Number(data.total) || 0;
        const frete = Number(window.ultimoCalculoFrete) || 0;
        const total = Number(subtotal) + frete;
        
        
        window.subtotalCarrinho = Number(subtotal)

        document.getElementById('subtotal').textContent =
            `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('frete').textContent =
            `R$ ${frete.toFixed(2).replace('.', ',')}`;
        document.getElementById('total').textContent =
            `R$ ${total.toFixed(2).replace('.', ',')}`;

    } catch (error) {
        console.error('Erro ao atualizar totais:', error);
    }
}

async function finalizarCompra() {
    try {
        const token = getToken();

        if (!token) {
            alert('Você precisa estar logado para finalizar a compra!');
            window.location.href = '/login';
            return;
        }
        console.log(window.ultimoCalculoFrete);
        
        if (window.ultimoCalculoFrete === undefined || window.ultimoCalculoFrete === null) {
            alert("Escolha um frete antes de finalizar a compra!");
            return;
        }

        const confirmar = confirm('Deseja finalizar a compra?');
        if (!confirmar) return;

        const response = await fetch(`${API_URL}/orders/criarOrder`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                notes: null,
                frete: window.ultimoCalculoFrete
            })
        });

        const data = await handleResponse(response);
        let preco_final = data.total_preco + window.ultimoCalculoFrete

        alert(`Pedido realizado com sucesso! ID de compra: ${data.compra_id}, Numero da ordem:${data.order_numero}, total: ${preco_final.toFixed(2).replace('.', ',')}`);
        window.location.href = '/produtos';

    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        alert('Erro ao finalizar compra. Tente novamente.');
    }
}

document.getElementById("finalizarCompra").addEventListener("click", finalizarCompra);

function calcularFreteFinal() {
    const cep = document.getElementById("cep").value;
    console.log("CEP recebido:", cep, typeof cep);
    const subtotal = window.subtotalCarrinho || 0;

    const opcoes = calcularFrete(cep, subtotal);

    if (!opcoes) {
        alert("CEP inválido!");
        return;
    }

    const select = document.getElementById("freteOpcoes");
    if (!select) {
        console.error("select #freteOpcoes não encontrado no DOM!");
        return;
    }

    select.innerHTML = "";

    opcoes.forEach((f, idx) => {
        const option = document.createElement("option");
        option.value = JSON.stringify(f);
        option.textContent = `${f.nome} - R$ ${f.preco.toFixed(2)}`;
        if (idx === 0) {
            option.selected = true;
            try {
                const parsed = f;
                window.ultimoCalculoFrete = Number(parsed.preco);
            } catch (err) {
                window.ultimoCalculoFrete = Number(f.preco);
            }
        }
        select.appendChild(option);
    });

    select.replaceWith(select.cloneNode(true));
    const freshSelect = document.getElementById("freteOpcoes");

    freshSelect.addEventListener("change", () => {
        try {
            const frete = JSON.parse(freshSelect.value);
            window.ultimoCalculoFrete = Number(frete.preco);
            console.log("Frete selecionado (change):", window.ultimoCalculoFrete);
            atualizarTotais();
        } catch (err) {
            console.error("Erro ao parsear opção de frete:", err, freshSelect.value);
            window.ultimoCalculoFrete = null;
        }
    });

    console.log("Frete selecionado (default):", window.ultimoCalculoFrete);
    atualizarTotais();
}



document.getElementById("btnCalcularFrete").addEventListener("click", () => calcularFreteFinal());

document.addEventListener("DOMContentLoaded", () => {
    const btnFrete = document.getElementById("btnCalcularFrete");

    if (btnFrete) {
        btnFrete.addEventListener("click", calcularFreteFinal);
    } else {
        console.error("ERRO: Botão Calcular Frete NÃO encontrado no DOM!");
    }
});


// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();

    // Verificar autenticação e atualizar UI do header
    const token = getToken();
    if (!token) {
        // Pode redirecionar para login ou apenas mostrar mensagem
        console.log('Usuário não autenticado');
    }
});
