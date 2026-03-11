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

// document.getElementById('contactForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     alert('ההודעה נשלחה בהצלחה!');
// });

    function updateButtonDisplay() {
        // קבלת הערך מ-localStorage
        const storedValue = localStorage.getItem('userRole');
  
        // אם הערך אינו ריק, הצג את הכפתור
        if (storedValue) {
          document.getElementById('private').style.display = 'block';
        } else {
          // אם הערך ריק, נסה להסתיר את הכפתור (לא באמת נדרש, כבר מוסתר כברירת מחדל)
          document.getElementById('private').style.display = 'none';
        }
      }
  
      // קריאה לפונקציה כשהדף נטען
      document.addEventListener('DOMContentLoaded', updateButtonDisplay);
 function privateArea()
 {
    const storedValue = localStorage.getItem('userRole');
    if(storedValue=='admin'){
        window.location.href='../html/adminArea.html'
    }
    if(storedValue=='chef'){
        window.location.href='../html/chefArea.html'
    }
    
        window.location.href='../html/userArea.html'
        
 }
 const serviceID = 'service_08zw80n'; // מזהה השירות שלך
const templateID = '__ejs-test-mail-service__'; // מזהה התבנית שלך
const userID = 'vWTFmQ7ueeKO9ufyzT8O7'; // מזהה המשתמש שלך
console.log(document)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('email-form');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // מונע את רענון הדף בעת שליחה

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_id: 'service_08zw80n', // מזהה השירות שלך
                    template_id: 'template_69wysr8', // מזהה התבנית שלך
                    user_id: '5D5oUiB9jpvMBzkEY', // מזהה המשתמש שלך
                    template_params: {
                        from_name: name,
                        from_email: email,
                        message: message
                    }
                })
            });

            if (response.ok) {
                document.getElementById('status-message').textContent = 'Email sent successfully!';
                form.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            document.getElementById('status-message').textContent = 'Failed to send email. Please try again.';
            console.error('Error sending email:', error);
        }
    });
});
