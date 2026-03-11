// // updateChef.js
// document.addEventListener('DOMContentLoaded', async () => {
//     const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
//     try {
//         const response = await fetch(`http://localhost:8080/chef/getById`, {
//             headers: {
//                 'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
//             }
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const chef = await response.json();

//         // Populate the form fields with current chef data
//         document.getElementById('chefId').value = chef._id;
//         document.getElementById('name').value = chef.name;
//         document.getElementById('email').value = chef.email;
//         document.getElementById('description').value = chef.description;
//         document.getElementById('category').value = chef.category;
//         document.getElementById('typeKitchen').value = chef.typeKitchen.join(', ');
//         // Handle form submission
//         document.getElementById('updateForm').addEventListener('submit', async (event) => {
//             event.preventDefault();

//             const updatedChef = {
//                 name: document.getElementById('name').value,
//                 email: document.getElementById('email').value,
//                 description: document.getElementById('description').value,
//                 category: document.getElementById('category').value,
//                 typeKitchen: document.getElementById('typeKitchen').value.split(',').map(s => s.trim()),
//             };

//             try {
//                 const response = await fetch(`http://localhost:8080/chef/updateChef`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
//                     },
//                     body: JSON.stringify(updatedChef)
//                 });

//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 alert('Chef updated successfully');
//                 window.location.href = '../html/privateArea.html'; // Redirect to view page
//             } catch (error) {
//                 console.error('Error:', error);
//                 alert('Error updating chef.');
//             }
//         });

//         // Handle delete button click
//         document.getElementById('deleteButton').addEventListener('click', async () => {
//             const confirmation = confirm('Are you sure you want to delete this chef?');
//             if (confirmation) {
//                 try {
//                     const response = await fetch(`http://localhost:8080/chef/delete`, {
//                         method: 'DELETE',
//                         headers: {
//                             'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
//                         }
//                     });

//                     if (!response.ok) {
//                         throw new Error('Network response was not ok');
//                     }
//                     alert('Chef deleted successfully');
//                     window.location.href = 'home.html'; // Redirect to home page or another appropriate page
//                 } catch (error) {
//                     console.error('Error:', error);
//                     alert('Error deleting chef.');
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('Error:', error);
//         alert('Error fetching chef data.');
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage

    // טופס העדכון
    const updateForm = document.getElementById('updateForm');
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const chefData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            image: document.getElementById('image').value,
            galery: document.getElementById('galery').value.split(','),
            phone: document.getElementById('phone').value,
            category: document.getElementById('category').value,
            typeKitchen: document.getElementById('typeKitchen').value.split(','),
            description: document.getElementById('description').value,
        };
        try {
            const response = await fetch(`http://localhost:8080/chef/updateChef`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                },
                body: JSON.stringify(chefData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Chef updated successfully');
            
            window.location.href = '../html/privateArea.html'; // Redirect to view page
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating chef.');
        }
    });

    // כפתור מחיקה
    document.getElementById('deleteButton').addEventListener('click', async () => {
        const confirmation = confirm('Are you sure you want to delete this chef?');
        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:8080/chef/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                alert('Chef deleted successfully');
                localStorage.clear()
                window.location.href = 'home.html'; // Redirect to home page or another appropriate page
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting chef.');
            }
        }
    });

    // קבלת פרטי השף מהשרת
    async function loadChefData() {
        try {
            const response = await fetch(`http://localhost:8080/chef/getById`, {
                headers: {
                    'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const chef = await response.json();
            document.getElementById('name').value = chef.name;
            document.getElementById('email').value = chef.email;
            document.getElementById('password').value = chef.password;
            document.getElementById('image').value = chef.image;
            document.getElementById('galery').value = chef.galery.join(',');
            document.getElementById('phone').value = chef.phone;
            document.getElementById('category').value = chef.category;
            document.getElementById('typeKitchen').value = chef.typeKitchen.join(',');
            document.getElementById('description').value = chef.description;
        } catch (error) {
            console.error('Error:', error);
            alert('Error loading chef data.');
        }
    }

    loadChefData();
});
