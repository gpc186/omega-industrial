//carrousel de produtos
const track = document.querySelector('.carrousel-track');
const prevBtn = document.getElementById('prevBtn')
const nextBtn = Document.getElementById('nextBtn')

    let currentIndex = 0
    const cardWidth = 260
    const visibleCount = 4
    const totalCards = 8

    function updateButtons(){
        prevBtn.disabled = currentIndex === 0
        nextBtn.disabled = currentIndex >= totalCards - visibleCount
    }

    function updateCarrousel(){
        const offset = -currentIndex * cardWidth
        track.style.transform = `translateX(${offset}px)`
        updateButtons()
    }

    nextBtn.addEventListener('click', () => {
        if(currentIndex < totalCards - visibleCount){
            currentIndex++
            updateCarrousel()
        }  
    })
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
        }
    })

    //Touch Support
    let startX = 0
    let isDragging = false
    let lastTranslateX = 0

    track.addEventListener('touchstart', (e) => { 
        startX = e.touches[0].clientX
        isDragging = true
        track.style.transition = 'none'
    })

    track.addEventListener('touchmove', (e) => { 
        if (!isDragging) return
        const currentX = e.touches[0].clientX
        const deltaX = currentX - startX
        const translateX = lastTranslateX + deltaX
        track.style.transform = `translateX(${translateX}px)`
    })

    track.addEventListener('touchend', (e) => { 
        isDragging = false
        const endX = e.changedTouches[0].clientX
        const deltaX = endX - startX    
        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0 && currentIndex < totalCards - visibleCount) {
                currentIndex++
            } else if (deltaX > 0 && currentIndex > 0) {
                currentIndex--
            }   
        }
        updateCarrousel()
    })

    //Inicializar
    updateCarrousel()