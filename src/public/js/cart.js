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
                    <button onclick="diminuirQuantidade('${item.product_id}', ${item.quantidade})">-</button>
                    <input type="number" 
                           value="${item.quantidade}" 
                           min="1" 
                           readonly>
                    <button onclick="aumentarQuantidade('${item.product_id}', ${item.quantidade})">+</button>
                </div>
            </div>
            
            <div class="card-item__actions">
                <div class="card-item__remove">
                    <button onclick="removerItem('${item.product_id}')" title="Remover item">
                        x
                    </button>
                </div>
                
                <div class="card-item__price">
                    R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </div>
            </div>
        </div>
    `).join('');
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

        const subtotal = data.totalPrice || 0;
        const frete = 0; // Definir lógica de frete se necessário
        const total = subtotal + frete;

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

        const confirmar = confirm('Deseja finalizar a compra?');
        if (!confirmar) return;

        const response = await fetch(`${API_URL}/orders/criarOrder`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ notes: null })
        });

        const data = await handleResponse(response);
        const dados = JSON.parse(data)

        alert(`Pedido realizado com sucesso! ID de compra: ${dados.compra_id}, Numero da ordem:${dados.order_numero}, total: ${dados.total_preco}`);
        window.location.href = '/produtos';

    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        alert('Erro ao finalizar compra. Tente novamente.');
    }
}

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

// ==================== MENU HAMBÚRGUER ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const body = document.body;

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}




function maskCEP(input) {
    let value = input.value.replace(/\D/g, ""); // remove tudo que não é número

    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, "$1-$2"); // adiciona o hífen
    }

    input.value = value;
}


document.addEventListener("DOMContentLoaded", () => {
    const selectReal = document.getElementById("tiposFrete");

    // Toggle abrir/fechar
    display.addEventListener("click", (e) => {
        e.stopPropagation();
        options.classList.toggle("open");
        display.classList.toggle("active");
    });

    // Clicar em item
    options.querySelectorAll("div").forEach(item => {
        item.addEventListener("click", () => {
            const value = item.dataset.value;

            // Atualiza display
            display.textContent = item.textContent;

            // Atualiza visual da seleção
            options.querySelectorAll("div").forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");

            // Atualiza select real (para funcionar no filtro)
            selectReal.value = value;
            selectReal.dispatchEvent(new Event("change"));

            // Fecha dropdown
            options.classList.remove("open");
            display.classList.remove("active");
        });
    });

    // Fecha ao clicar fora
    document.addEventListener("click", () => {
        options.classList.remove("open");
        display.classList.remove("active");
    });
});