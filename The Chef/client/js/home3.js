document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.hero-slider');
    const slideCount = slides.children.length;
    let index = 0;

    function showNextSlide() {
        index = (index + 1) % slideCount;
        slides.style.transform = `translateX(-${index * 100}%)`;
    }

    setInterval(showNextSlide, 3000); // Change slide every 3 seconds
});
