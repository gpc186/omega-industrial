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

// ==================== AUTENTICAÇÃO ==================== //
async function registrar(dados) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    return handleResponse(response);
}

async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
}

async function pegarDadosUsuario() {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

// ==================== PRODUTOS ==================== //
async function listarProdutos() {
    const response = await fetch(`${API_URL}/product/all`);
    return handleResponse(response);
}

async function buscarProduto(id) {
    const response = await fetch(`${API_URL}/product/${id}/product`);
    return handleResponse(response);
}

async function criarProduto(formData) {
    const response = await fetch(`${API_URL}/product/adm/createProd`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData // FormData já tem Content-Type correto
    });
    return handleResponse(response);
}

async function atualizarProduto(id, formData) {
    const response = await fetch(`${API_URL}/product/adm/${id}/updateProd`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
    });
    return handleResponse(response);
}

async function deletarProduto(id) {
    const response = await fetch(`${API_URL}/product/adm/${id}/removeProd`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

// ==================== CATEGORIAS ==================== //
async function listarCategorias() {
    const response = await fetch(`${API_URL}/category/getAll`);
    return handleResponse(response);
}

async function buscarProdutosPorCategoria(categoryId) {
    const response = await fetch(`${API_URL}/category/${categoryId}/category`);
    return handleResponse(response);
}

async function criarCategoria(nome, description) {
    const response = await fetch(`${API_URL}/category/adm/createCat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome, description })
    });
    return handleResponse(response);
}

async function atualizarCategoria(nome, description, id) {
    const response = await fetch(`${API_URL}/category/adm/${id}/updateCat`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nome, description })
    });
    return handleResponse(response);
}

async function deletarCategoria(id) {
    const response = await fetch(`${API_URL}/category/adm/${id}/removeCat`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}


// ==================== CARRINHO ====================
async function adicionarAoCarrinho(productId, quantity = 1) {
    const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(response);
}

async function verCarrinho() {
    const response = await fetch(`${API_URL}/cart/list`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

async function atualizarQuantidadeCarrinho(productId, quantity) {
    const response = await fetch(`${API_URL}/cart/${productId}/updateCart`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
    });
    return handleResponse(response);
}

async function removerDoCarrinho(productId) {
    const response = await fetch(`${API_URL}/cart/${productId}/remove`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

async function totalCarrinho() {
    const response = await fetch(`${API_URL}/cart/total`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

async function contarItensCarrinho() {
    const response = await fetch(`${API_URL}/cart/count`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

// ==================== PEDIDOS ====================
async function finalizarCompra(notes = null) {
    const response = await fetch(`${API_URL}/orders/criarOrder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes })
    });
    return handleResponse(response);
}

async function meusPedidos() {
    const response = await fetch(`${API_URL}/orders/me`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

async function detalhesPedido(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}/order`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

async function listarTodosPedidos() {
    const response = await fetch(`${API_URL}/orders/adm/allOrders`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return handleResponse(response);
}

async function atualizarStatusPedido(orderId, status) {
    const response = await fetch(`${API_URL}/orders/adm/${orderId}/updateStatus`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(response);
}

export const api = {
    registrar,
    login,
    pegarDadosUsuario,

    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    deletarProduto,

    listarCategorias,
    buscarProdutosPorCategoria,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria,

    adicionarAoCarrinho,
    verCarrinho,
    atualizarQuantidadeCarrinho,
    removerDoCarrinho,
    totalCarrinho,
    contarItensCarrinho,

    finalizarCompra,
    meusPedidos,
    detalhesPedido,
    listarTodosPedidos,
    atualizarStatusPedido
};
