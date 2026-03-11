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
