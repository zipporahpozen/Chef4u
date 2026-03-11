document.addEventListener('DOMContentLoaded', async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const menuId = urlParams.get('menuId'); // קבלת ה-ID מה-URL

    if (!menuId) {
        alert('No menu ID provided');
        return;
    }

    // טען את פרטי התפריט מהשרת
    try {
        const response = await fetch(`http://localhost:8080/menu/getMenuById/${menuId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const menu = await response.json();

        // מלא את הטופס עם הנתונים שהתקבלו
        document.getElementById('menuName').value = menu.name;
        document.getElementById('menuCategory').value = menu.category;
        document.getElementById('menuTypeKitchen').value = menu.typeKitchen;
        document.getElementById('menuDescription').value = menu.description;

        // מלא את תפריט המנות
        const dishesContainer = document.getElementById('dishesContainer');
        menu.dishes.forEach((dish, index) => {
            const newDish = document.createElement('div');
            newDish.className = 'dish';
            newDish.dataset.index = index;
            newDish.innerHTML = `
                <h3>Dish ${index + 1}</h3>
                <label for="dishName${index}">Name:</label>
                <input type="text" id="dishName${index}" name="dishName[]" value="${dish.name}"><br>

                <label for="dishCategory${index}">Category:</label>
                <input type="text" id="dishCategory${index}" name="dishCategory[]" value="${dish.category}"><br>

                <label for="dishPrice${index}">Price:</label>
                <input type="number" id="dishPrice${index}" name="dishPrice[]" min="0" value="${dish.price}"><br>

                <label for="dishImage${index}">Image:</label>
                <input type="file" id="dishImage${index}" name="dishImage[]"><br>
            `;
            dishesContainer.appendChild(newDish);
        });
    } catch (error) {
        alert('Error loading menu: ' + error.message);
        console.error('Error:', error);
    }

    // הוספת מנה חדשה
    document.getElementById('addDishBtn').addEventListener('click', () => {
        const dishCount = document.querySelectorAll('.dish').length;
        const newDish = document.createElement('div');
        newDish.className = 'dish';
        newDish.dataset.index = dishCount;
        newDish.innerHTML = `
            <h3>Dish ${dishCount + 1}</h3>
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

    // עדכון התפריט
    document.getElementById('menuForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
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
            const response = await fetch(`http://localhost:8080/chef/updateMenu/${menuId}`, {
                method: 'PUT',
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(menu)
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            alert('Menu updated successfully!');
            console.log('Success:', data);
            window.location.href = "../html/chefMenu.html";
        } catch (error) {
            alert('Error updating menu: ' + error.message);
            console.error('Error:', error);
        }
    });

    // מחיקת התפריט
    document.getElementById('deleteMenuBtn').addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this menu?')) return;

        const token = localStorage.getItem('token');
        try { 
            const response = await fetch(`http://localhost:8080/chef/deleteMenu/${menuId}`,{
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Menu deleted successfully!');
            window.location.href = "../html/chefMenu.html";
        } catch (error) {
            alert('Error deleting menu: ' + error.message);
            console.error('Error:', error);
        }
    });

});
