const API_URL = 'http://localhost:4000/api';

// ========== MENU HAMBÚRGUER ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const body = document.body;

if (hamburger && navMenu) {
    // Toggle do menu hambúrguer
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// Impede seleção de texto acidental
document.body.style.userSelect = "none";
if (navMenu) {
    navMenu.style.userSelect = "auto";
}




// ===================== CARREGAR LANÇAMENTOS DO BANCO =====================
async function carregarLancamentos() {
    try {
        // Buscar todos os produtos do banco de dados via API
        const response = await fetch(`${API_URL}/product/all`);
        
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos do banco de dados');
        }

        const data = await response.json();
        
        // Verificar se a resposta tem produtos
        if (!data.ok || !data.produtos) {
            throw new Error('Resposta inválida da API');
        }

        const produtos = data.produtos;

        // Ordenar por data de criação (mais recentes primeiro) e pegar os 6 últimos adicionados
        const lancamentos = produtos
            .sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA; // Mais recente primeiro
            })
            .slice(0, 6) // Pega apenas os 6 primeiros (mais recentes)
            .map(produto => {
                
                if (produto.image_urls) {
                    // Se image_urls é uma string JSON, fazer parse
                    let imageArray = [];
                    if (typeof produto.image_urls === 'string') {
                        try {
                            imageArray = JSON.parse(produto.image_urls);
                        } catch (e) {
                            imageArray = [];
                        }
                    } else if (Array.isArray(produto.image_urls)) {
                        imageArray = produto.image_urls;
                    }
                
                }

                return {
                    id: produto.id,
                    titulo: produto.nome,
                    descricao: produto.descricao || 'Produto de alta qualidade para aplicações industriais',
                    preco: parseFloat(produto.preco) || 0,
                    categoria: produto.categoria_nome || 'Produto Industrial',
                    created_at: produto.created_at
                };
            });

        // Se não houver produtos no banco, mostrar mensagem
        if (lancamentos.length === 0) {
            mostrarMensagemVazia();
            return;
        }

        console.log(`✅ ${lancamentos.length} lançamentos carregados do banco de dados`);

        // Renderizar o carrossel com os produtos do banco
        renderizarCarrossel(lancamentos);

    } catch (error) {
        console.error('❌ Erro ao carregar lançamentos do banco:', error);
        mostrarErro();
    }
}

// ===================== RENDERIZAR CARROSSEL =====================
function renderizarCarrossel(lancamentos) {
    const container = document.getElementById('lancamentos-carousel-container');
    if (!container) return;

    container.innerHTML = `
        <button class="lancamentos-nav-btn" id="btn-prev" aria-label="Anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
        
        <div class="lancamentos-carousel-wrapper">
            <div class="lancamentos-cards-track" id="cards-track">
                ${lancamentos.map((produto, index) => `
                    <div class="lancamentos-card" data-index="${index}" onclick="irParaProduto(${produto.id})">
                        <img src="${produto.imagem}" class="lancamentos-card-img" alt="${produto.titulo}"">
                        <div class="lancamentos-card-overlay">
                            <span class="lancamentos-card-categoria">${produto.categoria || 'Produto'}</span>
                            <h5 class="lancamentos-card-titulo">${produto.titulo}</h5>
                            <p class="lancamentos-card-desc">${produto.descricao}</p>
                            <p class="lancamentos-card-preco">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <button class="lancamentos-nav-btn" id="btn-next" aria-label="Próximo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
    `;

    // Renderizar indicadores
    renderizarIndicadores(lancamentos.length);

    // Inicializar o carrossel
    new CarouselLancamentos(lancamentos.length);
}

// ===================== RENDERIZAR INDICADORES =====================
function renderizarIndicadores(totalProdutos) {
    const indicatorsContainer = document.getElementById('lancamentos-indicators');
    if (!indicatorsContainer) return;

    const numIndicators = Math.ceil(totalProdutos / 3);
    indicatorsContainer.innerHTML = Array.from({ length: numIndicators }, (_, i) =>
        `<span class="indicador ${i === 0 ? 'ativo' : ''}" data-index="${i}"></span>`
    ).join('');
}

// ===================== MOSTRAR MENSAGEM VAZIA =====================
function mostrarMensagemVazia() {
    const container = document.getElementById('lancamentos-carousel-container');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #666;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" style="margin-bottom: 1rem;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p style="font-size: 1.2rem; margin: 0;">Nenhum produto cadastrado no banco de dados ainda.</p>
            <p style="font-size: 0.95rem; color: #999; margin-top: 0.5rem;">Adicione produtos para vê-los aqui.</p>
        </div>
    `;
    
    // Esconder indicadores
    const indicators = document.getElementById('lancamentos-indicators');
    if (indicators) indicators.style.display = 'none';
}

// ===================== MOSTRAR ERRO =====================
function mostrarErro() {
    const container = document.getElementById('lancamentos-carousel-container');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #dc3545;">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="1.5" style="margin-bottom: 1rem;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p style="font-size: 1.2rem; margin: 0;">Erro ao conectar com o banco de dados.</p>
            <p style="font-size: 0.95rem; color: #999; margin-top: 0.5rem;">Verifique se a API está rodando na porta 4000.</p>
            <button onclick="carregarLancamentos()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #004e64; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem;">
                Tentar Novamente
            </button>
        </div>
    `;
    
    // Esconder indicadores
    const indicators = document.getElementById('lancamentos-indicators');
    if (indicators) indicators.style.display = 'none';
}

// ===================== IR PARA PRODUTO =====================
function irParaProduto(produtoId) {
    window.location.href = `/produto?id=${produtoId}`;
}

// ===================== CLASSE DO CARROSSEL =====================
class CarouselLancamentos {
    constructor(totalCards) {
        this.currentIndex = 0;
        this.cardsPerView = 3;
        this.totalCards = totalCards;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCarousel();
    }

    setupEventListeners() {
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');

        if (btnPrev) btnPrev.addEventListener('click', () => this.prev());
        if (btnNext) btnNext.addEventListener('click', () => this.next());

        // Indicadores
        const indicators = document.querySelectorAll('.indicador');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index * this.cardsPerView);
            });
        });

        // Touch events para mobile
        const track = document.getElementById('cards-track');
        if (track) {
            let startX = 0;
            let isDragging = false;

            track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });

            track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
                isDragging = false;
            });
        }

        // Responsividade
        window.addEventListener('resize', () => this.handleResize());
    }

    updateCarousel() {
        const track = document.getElementById('cards-track');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');

        if (!track) return;

        // Calcular o deslocamento
        const cardWidth = 100 / this.cardsPerView;
        const offset = -(this.currentIndex * cardWidth);

        track.style.transform = `translateX(${offset}%)`;

        // Atualizar botões
        if (btnPrev) btnPrev.disabled = this.currentIndex === 0;
        if (btnNext) btnNext.disabled = this.currentIndex >= this.maxIndex;

        // Atualizar indicadores
        const currentIndicator = Math.floor(this.currentIndex / this.cardsPerView);
        document.querySelectorAll('.indicador').forEach((indicator, index) => {
            indicator.classList.toggle('ativo', index === currentIndicator);
        });
    }

    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex = Math.min(this.currentIndex + this.cardsPerView, this.maxIndex);
            this.updateCarousel();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex = Math.max(this.currentIndex - this.cardsPerView, 0);
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.min(Math.max(0, index), this.maxIndex);
        this.updateCarousel();
    }

    handleResize() {
        const width = window.innerWidth;

        // Ajustar cards por visualização baseado no tamanho da tela
        if (width < 768) {
            this.cardsPerView = 1;
        } else if (width < 1024) {
            this.cardsPerView = 2;
        } else {
            this.cardsPerView = 3;
        }

        this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        this.updateCarousel();
    }
}

// ===================== INICIALIZAÇÃO =====================
document.addEventListener('DOMContentLoaded', () => {
    carregarLancamentos();
});

// Expor função globalmente para uso no onclick
window.irParaProduto = irParaProduto;