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