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
  
  // Carrossel de Produtos Relacionados
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        const cardsToShow = 4;
        const totalCards = track.children.length;
        const maxIndex = totalCards - cardsToShow;

        function updateCarousel() {
            const cardWidth = track.children[0].offsetWidth;
            const gap = 24; // 1.5rem
            const offset = -(currentIndex * (cardWidth + gap));
            track.style.transform = `translateX(${offset}px)`;
            
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Trocar imagem principal
        const images = [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Crect fill='%23f4f4f4' width='800' height='800'/%3E%3Ccircle cx='400' cy='400' r='200' fill='%23004e64' opacity='0.2'/%3E%3Ctext x='400' y='420' font-family='Arial' font-size='40' fill='%23004e64' text-anchor='middle'%3EResina Ep%C3%B3xi%3C/text%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Crect fill='%23f4f4f4' width='800' height='800'/%3E%3Crect x='250' y='250' width='300' height='300' fill='%23004e64' opacity='0.2'/%3E%3Ctext x='400' y='420' font-family='Arial' font-size='40' fill='%23004e64' text-anchor='middle'%3EVista 2%3C/text%3E%3C/svg%3E"
        ];

        function changeImage(index) {
            document.getElementById('mainImage').src = images[index];
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }

        // Responsividade do carrossel
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            if (width < 480) {
                cardsToShow = 1;
            } else if (width < 768) {
                cardsToShow = 2;
            } else if (width < 1024) {
                cardsToShow = 3;
            } else {
                cardsToShow = 4;
            }
            currentIndex = Math.min(currentIndex, totalCards - cardsToShow);
            updateCarousel();
        });

        // Inicializar
        updateCarousel();

    }
    // ==========================================
// GESTÃO DE IMAGENS DO PRODUTO
// ==========================================

// Array com as imagens disponíveis
const images = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Crect fill='%23f4f4f4' width='800' height='800'/%3E%3Ccircle cx='400' cy='400' r='200' fill='%23004e64' opacity='0.2'/%3E%3Ctext x='400' y='420' font-family='Arial' font-size='40' fill='%23004e64' text-anchor='middle'%3EResina Ep%C3%B3xi%3C/text%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Crect fill='%23f4f4f4' width='800' height='800'/%3E%3Crect x='250' y='250' width='300' height='300' fill='%23004e64' opacity='0.2'/%3E%3Ctext x='400' y='420' font-family='Arial' font-size='40' fill='%23004e64' text-anchor='middle'%3EVista 2%3C/text%3E%3C/svg%3E"
];

// Função para trocar a imagem principal
function changeImage(index) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && images[index]) {
        // Troca a imagem principal
        mainImage.src = images[index];
        
        // Remove a classe 'active' de todas as thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Adiciona a classe 'active' na thumbnail clicada
        thumbnails[index].classList.add('active');
    }
}

// ==========================================
// CARROSSEL DE PRODUTOS RELACIONADOS
// ==========================================

class ProductCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        this.totalCards = this.track ? this.track.children.length : 0;
        
        this.init();
    }
    
    getCardsToShow() {
        const width = window.innerWidth;
        if (width < 480) return 1;
        if (width < 768) return 2;
        if (width < 1024) return 3;
        return 4;
    }
    
    get maxIndex() {
        return Math.max(0, this.totalCards - this.cardsToShow);
    }
    
    updateCarousel() {
        if (!this.track || this.totalCards === 0) return;
        
        const firstCard = this.track.children[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = parseFloat(getComputedStyle(this.track).gap) || 32;
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Atualiza estado dos botões
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    handleResize() {
        const newCardsToShow = this.getCardsToShow();
        if (newCardsToShow !== this.cardsToShow) {
            this.cardsToShow = newCardsToShow;
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.updateCarousel();
        }
    }
    
    init() {
        if (!this.track || !this.prevBtn || !this.nextBtn) {
            console.error('Elementos do carrossel não encontrados');
            return;
        }
        
        // Event listeners dos botões
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Event listener para redimensionamento
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 250);
        });
        
        // Inicializa o carrossel
        this.updateCarousel();
    }
}

// ==========================================
// INICIALIZAÇÃO QUANDO O DOM ESTIVER PRONTO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o carrossel
    const carousel = new ProductCarousel();
    
    // Adiciona feedback visual ao botão de compra
    const buyButton = document.querySelector('.btt-buy');
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            buyButton.textContent = 'Adicionado! ✓';
            buyButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20833a 100%)';
            
            setTimeout(() => {
                buyButton.textContent = 'Adicionar ao Carrinho';
                buyButton.style.background = 'linear-gradient(135deg, #f7931e 0%, #e6841a 100%)';
            }, 2000);
        });
    }
    
    console.log('JavaScript carregado com sucesso!');
});

    
        