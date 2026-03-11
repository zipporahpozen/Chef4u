// JavaScript for hero slider functionality

let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function goToSlide(index) {
    document.querySelector('.hero-slider').style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentIndex);
}

setInterval(nextSlide, 5000); // Change slide every 5 seconds

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('ההודעה נשלחה בהצלחה!');
});
