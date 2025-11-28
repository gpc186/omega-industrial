



// ===================== CONFIGURAÇÕES GLOBAIS =====================
const API_BASE_URL = 'http://localhost:3000/api';
let salesChart = null;
let currentChartPeriod = 'monthly';


// ===================== MENU HAMBURGUER =====================

            const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // ⚡ Impede que o clique se propague
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fecha o menu quando clicar fora
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        // Impede seleção de texto acidental
        document.body.style.userSelect = "none";
        navMenu.style.userSelect = "auto"; // Só permite selecio



// ===================== INICIALIZAÇÃO =====================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está autenticado
    checkAuthentication();
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Event listeners para mudança de período do gráfico
    document.querySelectorAll('input[name="chartPeriod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentChartPeriod = this.value;
            loadSalesChart();
        });
    });
    
    // Event listener para logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
});

// ===================== AUTENTICAÇÃO =====================
function checkAuthentication() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'adm') {
        // Redirecionar para login se não estiver autenticado ou não for admin
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}

// ===================== CARREGAMENTO DE DADOS =====================
async function loadDashboardData() {
    try {
        // Carregar dados em paralelo
        await Promise.all([
            loadMetrics(),
            loadSalesChart(),
            loadLowStockProducts(),
            loadRecentSales()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showErrorAlert('Erro ao carregar dados do dashboard');
    }
}

// ===================== MÉTRICAS PRINCIPAIS =====================
async function loadMetrics() {
    try {
        const token = localStorage.getItem('token');
        
        // Buscar todos os pedidos
        const ordersResponse = await fetch(`${API_BASE_URL}/order/adm/allOrders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!ordersResponse.ok) {
            throw new Error('Erro ao buscar pedidos');
        }
        
        const ordersData = await ordersResponse.json();
        const orders = ordersData.pedidos || [];
        
        // Buscar todos os produtos
        const productsResponse = await fetch(`${API_BASE_URL}/produto/all`);
        
        if (!productsResponse.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        
        const productsData = await productsResponse.json();
        const products = productsData.produtos || [];
        
        // Calcular métricas
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Vendas do mês
        const monthlyOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        
        const monthlySales = monthlyOrders.reduce((total, order) => total + (order.total_preco || 0), 0);

        // Ticket médio (valor médio por pedido)
        const averageTicket = monthlyOrders.length > 0 ? monthlySales / monthlyOrders.length : 0;
        document.getElementById('averageTicket').textContent = formatCurrency(averageTicket);
        // Novos clientes (usuários criados este mês)
        const token2 = localStorage.getItem('token');
        let newCustomersCount = 0;
        
        try {
            // Nota: Este endpoint pode não existir, então tratamos o erro
            const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token2}`
                }
            });
            
            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                const users = usersData.users || [];
                newCustomersCount = users.filter(user => {
                    const userDate = new Date(user.created_at);
                    return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
                }).length;
            }
        } catch (error) {
            console.log('Endpoint de usuários não disponível, usando valor padrão');
            newCustomersCount = monthlyOrders.length; // Usar quantidade de pedidos como aproximação
        }
        
        // Produtos em estoque
        const totalStockItems = products.reduce((total, product) => total + (product.quantidade || 0), 0);
        
        // Valor total em estoque
        const totalStockValue = products.reduce((total, product) => {
            return total + ((product.preco || 0) * (product.quantidade || 0));
        }, 0);
        
        // Atualizar UI
        document.getElementById('monthlySales').textContent = formatCurrency(monthlySales);
        document.getElementById('newCustomers').textContent = formatNumber(newCustomersCount);
        document.getElementById('stockProducts').textContent = formatNumber(totalStockItems);
        document.getElementById('stockValue').textContent = formatCurrency(totalStockValue);
        
        // Calcular tendências (comparar com mês anterior)
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const previousMonthOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear;
        });
        
        const previousMonthlySales = previousMonthOrders.reduce((total, order) => total + (order.total_preco || 0), 0);
        const salesTrend = calculateTrend(previousMonthlySales, monthlySales);
        
        document.getElementById('salesTrend').innerHTML = `
            <i class="fas fa-arrow-${salesTrend >= 0 ? 'up text-success' : 'down text-danger'}"></i> 
            ${Math.abs(salesTrend).toFixed(1)}% vs mês anterior
        `;
        
    } catch (error) {
        console.error('Erro ao carregar métricas:', error);
        showErrorAlert('Erro ao carregar métricas');
    }
}

// ===================== GRÁFICO DE VENDAS =====================
async function loadSalesChart() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/order/adm/allOrders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados de vendas');
        }
        
        const data = await response.json();
        const orders = data.pedidos || [];
        
        // Preparar dados para o gráfico
        const chartData = prepareChartData(orders, currentChartPeriod);
        
        // Destruir gráfico anterior se existir
        if (salesChart) {
            salesChart.destroy();
        }
        
        // Criar novo gráfico
        const ctx = document.getElementById('salesChart').getContext('2d');
        
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Vendas (R$)',
                        data: chartData.sales,
                        borderColor: '#004e64',
                        backgroundColor: 'rgba(0, 78, 100, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#004e64',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        callbacks: {
                            label: function(context) {
                                return 'Vendas: ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Erro ao carregar gráfico de vendas:', error);
        showErrorAlert('Erro ao carregar gráfico de vendas');
    }
}

// ===================== PRODUTOS COM BAIXO ESTOQUE =====================
async function loadLowStockProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/produto/all`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        
        const data = await response.json();
        const products = data.produtos || [];
        
        // Filtrar produtos com estoque baixo (menos de 10 unidades)
        const lowStockProducts = products.filter(product => product.quantidade < 10).sort((a, b) => a.quantidade - b.quantidade);
        
        const container = document.getElementById('lowStockContainer');
        
        if (lowStockProducts.length === 0) {
            container.innerHTML = `
                <div class="no-low-stock">
                    <i class="fas fa-check-circle"></i>
                    <p>Todos os produtos têm estoque adequado!</p>
                </div>
            `;
        } else {
            let html = '';
            lowStockProducts.forEach(product => {
                html += `
                    <div class="low-stock-item">
                        <div class="product-name">${product.nome}</div>
                        <div class="stock-info">
                            Estoque: <span class="stock-quantity">${product.quantidade}</span> unidades
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
        
    } catch (error) {
        console.error('Erro ao carregar produtos com baixo estoque:', error);
        document.getElementById('lowStockContainer').innerHTML = '<p class="text-danger">Erro ao carregar dados</p>';
    }
}

// ===================== ÚLTIMAS VENDAS =====================
async function loadRecentSales() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/order/adm/allOrders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos');
        }
        
        const data = await response.json();
        let orders = data.pedidos || [];
        
        // Ordenar por data (mais recentes primeiro) e pegar os últimos 10
        orders = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
        
        const tbody = document.getElementById('salesTableBody');
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Nenhuma venda encontrada</td></tr>';
            return;
        }
        
        let html = '';
        orders.forEach(order => {
            const statusClass = getStatusClass(order.status);
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString('pt-BR');
            
            html += `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td>${order.user_name || 'Cliente'}</td>
                    <td>${order.item_count || 1} produto(s)</td>
                    <td>${order.total_items || 1}</td>
                    <td>${formatCurrency(order.total_preco)}</td>
                    <td><span class="status-badge ${statusClass}">${formatStatus(order.status)}</span></td>
                    <td>${formattedDate}</td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewOrder(${order.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-edit" onclick="editOrderStatus(${order.id})" title="Editar Status">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
    } catch (error) {
        console.error('Erro ao carregar últimas vendas:', error);
        document.getElementById('salesTableBody').innerHTML = '<tr><td colspan="8" class="text-center text-danger py-4">Erro ao carregar dados</td></tr>';
    }
}

// ===================== FUNÇÕES AUXILIARES =====================

function prepareChartData(orders, period) {
    const labels = [];
    const sales = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    if (period === 'monthly') {
        // Últimos 12 meses
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentYear, currentDate.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
            labels.push(monthName);
            
            const monthSales = orders
                .filter(order => {
                    const orderDate = new Date(order.created_at);
                    return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
                })
                .reduce((total, order) => total + (order.total_preco || 0), 0);
            
            sales.push(monthSales);
        }
    } else if (period === 'quarterly') {
        // Últimos 4 trimestres
        for (let i = 3; i >= 0; i--) {
            const quarter = Math.floor(currentDate.getMonth() / 3) - i;
            const year = currentYear + Math.floor((currentDate.getMonth() - i * 3) / 12);
            const startMonth = (quarter % 4) * 3;
            
            labels.push(`Q${(quarter % 4) + 1} ${year}`);
            
            const quarterSales = orders
                .filter(order => {
                    const orderDate = new Date(order.created_at);
                    const orderQuarter = Math.floor(orderDate.getMonth() / 3);
                    return orderQuarter === (quarter % 4) && orderDate.getFullYear() === year;
                })
                .reduce((total, order) => total + (order.total_preco || 0), 0);
            
            sales.push(quarterSales);
        }
    } else if (period === 'annual') {
        // Últimos 5 anos
        for (let i = 4; i >= 0; i--) {
            const year = currentYear - i;
            labels.push(year.toString());
            
            const yearSales = orders
                .filter(order => {
                    const orderDate = new Date(order.created_at);
                    return orderDate.getFullYear() === year;
                })
                .reduce((total, order) => total + (order.total_preco || 0), 0);
            
            sales.push(yearSales);
        }
    }
    
    return { labels, sales };
}

function getStatusClass(status) {
    const statusMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pendente',
        'processing': 'Processando',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

function calculateTrend(previousValue, currentValue) {
    if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
    }
    return ((currentValue - previousValue) / previousValue) * 100;
}

function showErrorAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('main').insertBefore(alert, document.querySelector('main').firstChild);
}

function viewOrder(orderId) {
    alert(`Visualizar pedido #${orderId}`);
    // Implementar visualização detalhada do pedido
}

function editOrderStatus(orderId) {
    const newStatus = prompt('Digite o novo status (pending/processing/completed/cancelled):');
    if (newStatus) {
        updateOrderStatus(orderId, newStatus);
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/order/adm/${orderId}/updateStatus`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar status');
        }
        
        // Recarregar a tabela de vendas
        loadRecentSales();
        
        alert('Status atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status do pedido');
    }
}