document.addEventListener('DOMContentLoaded', () => {
    const addDishBtn = document.getElementById('addDishBtn');
    const dishesContainer = document.getElementById('dishesContainer');
    let dishCount = 1;

    addDishBtn.addEventListener('click', () => {
        dishCount++;
        const newDish = document.createElement('div');
        newDish.className = 'dish';
        newDish.dataset.index = dishCount - 1;
        newDish.innerHTML = `
            <h3>Dish ${dishCount}</h3>
            <label for="dishName${dishCount}">Name:</label>
            <input type="text" id="dishName${dishCount}" name="dishName[]"><br>

            <label for="dishCategory${dishCount}">Category:</label>
            <input type="text" id="dishCategory${dishCount}" name="dishCategory[]"><br>

            <label for="dishPrice${dishCount}">Price:</label>
            <input type="number" id="dishPrice${dishCount}" name="dishPrice[]" min="0"><br>

            <label for="dishImage${dishCount}">Image:</label>
            <input type="file" id="dishImage${dishCount}" name="dishImage[]"><br>
        `;
        dishesContainer.appendChild(newDish);
    });

    document.getElementById('menuForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
        const formData = new FormData(event.target);
        const menu = {
            name: formData.get('menuName'),
            category: formData.get('menuCategory') || 'General',
            typeKitchen: formData.get('menuTypeKitchen') || 'Unknown',
            description: formData.get('menuDescription') || 'No description provided',
            image: await getFileBase64(formData.get('menuImage')), 
            dishes: []
        };

        const dishNames = formData.getAll('dishName[]');
        const dishCategories = formData.getAll('dishCategory[]');
        const dishPrices = formData.getAll('dishPrice[]');
        const dishImages = formData.getAll('dishImage[]');

        for (let i = 0; i < dishNames.length; i++) {
            menu.dishes.push({
                name: dishNames[i] || 'Unnamed Item',
                category: dishCategories[i] || 'General',
                price: parseFloat(dishPrices[i]) || 0,
                image: await getFileBase64(dishImages[i]) || 'default-image-url' 
            });
        }

        try {
            const response = await fetch('http://localhost:8080/chef/menu/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                },
                body: JSON.stringify(menu)
            });
            console.log(menu);
            console.log(response);
            console.log(response.body)


            if (!response.ok)  {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
                alert('Menu created successfully!');
                console.log('Success:', data);
                window.location.href = "../html/home3.html";
        } catch (error) {
            alert('Error creating menu: ' + error.message);
            console.error('Error:', error);
        }
    });

    // פונקציה להמרת קובץ ל-Base64
    function getFileBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve('default-image-url');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
});
