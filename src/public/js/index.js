// ========== MENU HAMBÚRGUER ==========
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const body = document.body;

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
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






        function toggleAnswer(element) {
            const answer = element.nextElementSibling;
            const arrow = element.querySelector('.arrow');

            // Fecha todos os outros itens
            document.querySelectorAll('.faq-answer').forEach(item => {
                if (item !== answer) {
                    item.classList.remove('active');
                }
            });

            document.querySelectorAll('.arrow').forEach(item => {
                if (item !== arrow) {
                    item.classList.remove('active');
                }
            });

            // Toggle do item clicado
            answer.classList.toggle('active');
            arrow.classList.toggle('active');
        }




        // Dados dos produtos de lançamento
        const lancamentos = [
            {
                titulo: "Resina Epóxi Premium",
                descricao: "Alta resistência química e térmica para aplicações industriais",
                imagem: "../assets/img/Listas_MaioresEmpresasPrivadasEUA_231120_Getty.jpg"
            },
            {
                titulo: "Catalisador Avançado",
                descricao: "Otimização de processos petroquímicos com eficiência superior",
                imagem: "../assets/img/Listas_MaioresEmpresasPrivadasEUA_231120_Getty.jpg"
            },
            {
                titulo: "Aditivo Lubrificante",
                descricao: "Redução de atrito e maior durabilidade em equipamentos",
                imagem: "../assets/img/Listas_MaioresEmpresasPrivadasEUA_231120_Getty.jpg"
            },
            {
                titulo: "Polímero Especial",
                descricao: "Propriedades mecânicas excepcionais para indústria automotiva",
                imagem: "../assets/img/Listas_MaioresEmpresasPrivadasEUA_231120_Getty.jpg"
            },
            {
                titulo: "Solvente Industrial",
                descricao: "Pureza garantida para processos de alta precisão",
                imagem: "../assets/img/Listas_MaioresEmpresasPrivadasEUA_231120_Getty.jpg"
            }
        ];

        class CarouselLancamentos {
            constructor() {
                this.currentIndex = 0;
                this.cardsPerView = 3;
                this.totalCards = lancamentos.length;
                this.maxIndex = Math.max(0, this.totalCards - this.cardsPerView);

                this.init();
            }

            init() {
                this.renderCarousel();
                this.setupEventListeners();
                this.updateCarousel();
            }

            renderCarousel() {
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
                        <div class="lancamentos-card" data-index="${index}">
                            <img src="${produto.imagem}" class="lancamentos-card-img" alt="${produto.titulo}">
                            <div class="lancamentos-card-overlay">
                                <h5 class="lancamentos-card-titulo">${produto.titulo}</h5>
                                <p class="lancamentos-card-desc">${produto.descricao}</p>
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

                // Adicionar indicadores
                const indicatorsContainer = document.getElementById('lancamentos-indicators');
                if (indicatorsContainer) {
                    const numIndicators = Math.ceil(this.totalCards / this.cardsPerView);
                    indicatorsContainer.innerHTML = Array.from({ length: numIndicators }, (_, i) =>
                        `<span class="indicador ${i === 0 ? 'ativo' : ''}" data-index="${i}"></span>`
                    ).join('');
                }
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

        // Inicializar quando o DOM estiver pronto
        document.addEventListener('DOMContentLoaded', () => {
            new CarouselLancamentos();
        });