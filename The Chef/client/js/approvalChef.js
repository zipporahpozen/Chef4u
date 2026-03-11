
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if(localStorage.getItem('userRole')!='admin'){
            throw new Error("ADMIN ONLY")
        }
        const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
        
        // שליחת בקשה לשרת לקבלת השפים עם סטטוס false
        const response = await fetch('http://localhost:8080/chef/getApprovalChef/' ,{
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
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
                <p>Type of Kitchen: ${chef.typeKitchen}</p>
                <p>${chef.description}</p>
                <div class="buttons">
                    <button class="button approve-button" data-chef-id="${chef._id}" title="Approve">
                        <span class="approve-icon">✔️</span>
                        Approve
                    </button>
                </div>
            `;

            container.appendChild(chefCard);
        });

        // הוספת אירוע קליק לכל כפתור אישור
        document.querySelectorAll('.approve-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const chefId = e.target.closest('.approve-button').dataset.chefId;
                try {
                    const response = await fetch(`http://localhost:8080/admin/approve/${chefId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const updatedChef = await response.json();
                    // עדכון הממשק לפי הצורך (אפשר לנקות את התצוגה או לעדכן את הסטטוס)
                    alert(`Chef ${updatedChef.name} approved successfully!`);
                    location.reload(); // לטעון מחדש את הדף לאחר ההצלחה
                } catch (error) {
                    console.error('Error:', error);
                    alert('אירעה שגיאה באישור השף.');
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        alert('אירעה שגיאה בקבלת נתוני השפים.');
    }
});
