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
        
        if (!data.items || data.items.length === 0) {
            mostrarCarrinhoVazio();
            return;
        }

        renderizarCarrinho(data.items);
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
        <div class="card-item" data-product-id="${item.product._id}">
            <img class="card-item__image" 
                 src="${item.product.image || '../assets/img/placeholder.png'}" 
                 alt="${item.product.nome}"
                 onerror="this.src='../assets/img/placeholder.png'">
            
            <div class="card-item__info">
                <div class="card-item__details">
                    <h6>${item.product.nome}</h6>
                    <p>${item.product.description || 'Sem descrição'}</p>
                </div>
                
                <div class="card-item__quantity">
                    <button onclick="diminuirQuantidade('${item.product._id}', ${item.quantity})">-</button>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           readonly>
                    <button onclick="aumentarQuantidade('${item.product._id}', ${item.quantity})">+</button>
                </div>
            </div>
            
            <div class="card-item__actions">
                <div class="card-item__remove">
                    <button onclick="removerItem('${item.product._id}')" title="Remover item">
                        🗑️
                    </button>
                </div>
                
                <div class="card-item__price">
                    R$ ${(item.product.preco * item.quantity).toFixed(2).replace('.', ',')}
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
            window.location.href = '../pages/login.html';
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
        
        alert('Pedido realizado com sucesso!');
        window.location.href = '../pages/pedidos.html'; // Redirecionar para página de pedidos
        
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