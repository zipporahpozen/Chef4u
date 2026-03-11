document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
        // שליחת בקשה לשרת לקבלת המשתמשים עם הכי הרבה עוקבים
        const response = await fetch('http://localhost:8080/chef/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const chefList = await response.json();

        const container = document.getElementById('chefs-container');
        container.innerHTML = ''; // לנקות את התוכן הקיים

        chefList.forEach(chef => {
            const chefCard = document.createElement('div');
            chefCard.classList.add('chef-card');

            chefCard.innerHTML = `
                <img src="../${chef.image}" alt="chef Image">
                <h3>${chef.name}</h3>
                <p>typeKitchen: ${chef.typeKitchen}</p>
                <p>${chef.description}</p>
                <div class="buttons">
                    <button class="button like-button" data-chef-id="${chef._id}" title="Like">
                        <span class="like-icon">👍</span>
                        <span class="followers-count">${chef.followers.length}</span>
                    </button>
                </div>
            `;

            chefCard.dataset.link = `../html/chefMenu.html?id=${chef._id}`;
            chefCard.addEventListener('click', () => {
                window.location.href = chefCard.dataset.link;
            });

            container.appendChild(chefCard);
        });

        // הוספת אירוע קליק לכל כפתור לייק
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation(); // מונע שהקליק על כפתור הלייק יגרום גם להעבר עמוד
                const chefId = e.target.closest('.like-button').dataset.chefId;
                try {
                    if(localStorage.getItem('userRole'=='chef'))
                    {
                        alert('הינך מחובר כשף ואין באפשרותך לבצע פעולה זו ')
                        throw new Error('user only')
                    }
                    const response = await fetch(`http://localhost:8080/user/addAsFollow/${chefId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const updatedUser = await response.json();
                    // עדכון הממשק עם מספר העוקבים החדש
                    e.target.querySelector('.followers-count').textContent = updatedUser.followers.length;
                    
                } catch (error) {
                    console.error('Error:', error);
                    alert('אירעה שגיאה בהוספת הלייק.');
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        alert('אירעה שגיאה בקבלת נתוני המשתמשים.');
    }
});
