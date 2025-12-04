// ===================== CONFIGURAÇÕES GLOBAIS =====================
const API_BASE_URL = 'http://localhost:4000/api';
let currentProduct = null;
let relatedProducts = [];

// ===================== INICIALIZAÇÃO =====================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o menu hambúrguer
    initHamburgerMenu();

    const user = JSON.parse(localStorage.getItem('user'));

    console.log(user);

    if (!user) {
        const buttonBuy = document.getElementById("bttBuy");
        buttonBuy.textContent = 'Precisa logar antes!';
        buttonBuy.setAttribute('disabled', true)
    }

    // Carregar dados do produto baseado no ID da URL
    loadProductFromURL();

    const carousel = new ProductCarousel();

    console.log('JavaScript carregado com sucesso!');
});

// ===================== MENU HAMBÚRGUER =====================
function initHamburgerMenu() {
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
}

// ===================== CARREGAMENTO DINÂMICO DO PRODUTO =====================
async function loadProductFromURL() {
    try {
        // Obter o ID do produto da URL (ex: /produto?id=1)
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            showError('ID do produto não fornecido. Redirecionando para produtos...');
            setTimeout(() => {
                window.location.href = '/produtos';
            }, 2000);
            return;
        }

        // Buscar dados do produto no backend
        const response = await fetch(`${API_BASE_URL}/product/${productId}/product`);

        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }

        const data = await response.json();
        currentProduct = data.produto;

        // Carregar o produto na página
        loadProductData(currentProduct);

        // Carregar produtos relacionados
        await loadRelatedProducts();

    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        showError('Erro ao carregar o produto. Tente novamente mais tarde.');
    }
}

// ===================== CARREGAR DADOS DO PRODUTO =====================
function loadProductData(product) {
    if (!product) {
        showError('Dados do produto inválidos');
        return;
    }

    // Atualizar título da página
    document.title = `${product.nome} | OmegaPetro`;

    // Carregar imagens
    const imageUrls = product.image_urls || [];
    loadProductImages(imageUrls);

    // Atualizar informações do produto
    document.querySelector('.direita h1').textContent = product.nome;

    // Atualizar preço
    const priceElement = document.querySelector('.preco');
    priceElement.textContent = formatCurrency(product.preco);

    // Atualizar descrição
    const descriptionElement = document.querySelector('.direita > p');
    descriptionElement.textContent = product.descricao || 'Descrição não disponível';

    // Atualizar especificações técnicas (simuladas baseadas na categoria)
    updateSpecifications(product);

    // Adicionar event listener ao botão de compra
    const buyButton = document.querySelector('.btt-buy');
    if (buyButton) {
        buyButton.addEventListener('click', () => addToCart(product));
    }
}

// ===================== CARREGAR IMAGENS DO PRODUTO =====================
function loadProductImages(imageUrls) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.querySelector('.img-thumbnails');

    // Limpar thumbnails existentes
    thumbnailsContainer.innerHTML = '';

    if (imageUrls.length === 0) {
        // Usar imagem padrão se não houver imagens
        mainImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"%3E%3Crect fill="%23f4f4f4" width="800" height="800"/%3E%3Ccircle cx="400" cy="400" r="200" fill="%23004e64" opacity="0.2"/%3E%3Ctext x="400" y="420" font-family="Arial" font-size="40" fill="%23004e64" text-anchor="middle"%3EProduto%3C/text%3E%3C/svg%3E';
        return;
    }

    // Definir a primeira imagem como principal
    mainImage.src = imageUrls[0];

    // Criar thumbnails para cada imagem
    imageUrls.forEach((url, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.onclick = () => changeImage(index);

        const img = document.createElement('img');
        img.src = url;
        img.alt = `Vista ${index + 1}`;

        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// ===================== ATUALIZAR ESPECIFICAÇÕES =====================
function updateSpecifications(product) {
    const specsList = document.querySelector('.specs-list ul');
    specsList.innerHTML = '';

    // Especificações padrão baseadas no produto
    const specs = [
        { label: 'Categoria', value: product.categoria_nome || 'Não especificada' },
        { label: 'Quantidade em Estoque', value: `${product.quantidade || 0} unidades` },
        { label: 'Preço Unitário', value: formatCurrency(product.preco) },
        { label: 'Disponibilidade', value: product.quantidade > 0 ? 'Em estoque' : 'Fora de estoque' },
        { label: 'Código do Produto', value: `#${product.id}` }
    ];

    specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${spec.label}:</strong> <span>${spec.value}</span>`;
        specsList.appendChild(li);
    });
}

// ===================== TROCAR IMAGEM PRINCIPAL =====================
function changeImage(index) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (currentProduct && currentProduct.image_urls && currentProduct.image_urls[index]) {
        // Troca a imagem principal
        mainImage.src = currentProduct.image_urls[index];

        // Remove a classe 'active' de todas as thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));

        // Adiciona a classe 'active' na thumbnail clicada
        thumbnails[index].classList.add('active');
    }
}

// ===================== CARREGAR PRODUTOS RELACIONADOS =====================
async function loadRelatedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/product/all`);

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const data = await response.json();
        const allProducts = data.produtos || [];

        // Filtrar produtos relacionados (excluir o produto atual)
        relatedProducts = allProducts
            .filter(p => p.id !== currentProduct.id)
            .slice(0, 8); // Limitar a 8 produtos relacionados

        // Carregar produtos no carrossel
        loadCarouselProducts(relatedProducts);

    } catch (error) {
        console.error('Erro ao carregar produtos relacionados:', error);
    }
}

// ===================== CARREGAR PRODUTOS NO CARROSSEL =====================
function loadCarouselProducts(products) {
    const track = document.getElementById('carouselTrack');

    if (!track) return;

    // Limpar carrossel
    track.innerHTML = '';

    // Adicionar cada produto ao carrossel
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';
        card.onclick = () => {
            window.location.href = `/produto?id=${product.id}`;
        };

        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = product.image_urls && product.image_urls[0] ? product.image_urls[0] : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ccircle cx="200" cy="150" r="60" fill="%23004e64" opacity="0.2"/%3E%3C/svg%3E';
        img.alt = product.nome;

        const content = document.createElement('div');
        content.className = 'card-content';

        const title = document.createElement('h3');
        title.textContent = product.nome;

        const price = document.createElement('p');
        price.className = 'card-price';
        price.textContent = formatCurrency(product.preco);

        content.appendChild(title);
        content.appendChild(price);

        card.appendChild(img);
        card.appendChild(content);

        track.appendChild(card);
    });

    // Reinicializar o carrossel
    const carousel = new ProductCarousel();
}

// ===================== ADICIONAR AO CARRINHO =====================
async function addToCart(product) {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Você precisa estar logado para adicionar itens ao carrinho');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: product.id,
                quantidade: 1,
            })
        });

        if (!response.ok) {
            console.log(response);
            throw new Error("Não foi possivel adicionar ao carrinho!");
        }

        // Feedback visual
        const buyButton = document.querySelector('.btt-buy');
        const originalText = buyButton.textContent;
        buyButton.textContent = 'Adicionado! ✓';
        buyButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20833a 100%)';

        setTimeout(() => {
            buyButton.textContent = originalText;
            buyButton.style.background = 'linear-gradient(135deg, #f7931e 0%, #e6841a 100%)';
        }, 2000);

        alert('Produto adicionado ao carrinho com sucesso!');

    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        alert('Erro ao adicionar o produto ao carrinho');
    }
}

// ===================== CARROSSEL DE PRODUTOS RELACIONADOS =====================
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

// ===================== FUNÇÕES AUXILIARES =====================
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f8d7da;
        color: #721c24;
        padding: 15px 20px;
        border-radius: 5px;
        border: 1px solid #f5c6cb;
        z-index: 9999;
        max-width: 400px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
