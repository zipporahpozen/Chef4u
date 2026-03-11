document.addEventListener('DOMContentLoaded', () => {
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get menuId from URL
    const menuId = getQueryParam('menuId');
    
    if (menuId) {
        initializeForm(menuId); // Initialize the form with the menu ID
    } else {
        console.error('Menu ID not provided in URL');
    }

    // Function to fetch menu details
    async function fetchMenu(menuId) {
        try {
            const response = await fetch(`http://localhost:8080/menu/getMenuById/${menuId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    }

    // Function to initialize form with fetched data
    async function initializeForm() {
        const menuData = await fetchMenu(menuId);
        if (menuData) {
            document.getElementById('menuImage').src = menuData.image;
            document.getElementById('menuName').textContent = menuData.name;
            document.getElementById('chefName').textContent = menuData.creatorId;
            document.getElementById('menuDescription').textContent = menuData.description;

            const dishesContainer = document.getElementById('dishesContainer');
            menuData.dishes.forEach(dish => {
                const dishDiv = document.createElement('div');
                dishDiv.className = 'dish';
                dishDiv.innerHTML = `
                    <input type="checkbox" id="${dish.id}" data-price="${dish.price}">
                    <img src="${dish.image}" alt="${dish.name}">
                    <label for="${dish.id}">${dish.name} - $${dish.price.toFixed(2)}</label>
                `;
                dishesContainer.appendChild(dishDiv);
            });

            const today = new Date().toISOString().split('T')[0];
            document.getElementById('orderDate').setAttribute('min', today);
        }
    }

    // Function to calculate total price
    function calculateTotalPrice() {
        const checkboxes = document.querySelectorAll('#dishesContainer input[type="checkbox"]');
        let totalPrice = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                totalPrice += parseFloat(checkbox.dataset.price);
            }
        });
        totalPrice *= parseInt(document.getElementById('numberOfDishes').value, 10);
        document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    }

    // Function to submit order
    async function submitOrder(event) {
        const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
        event.preventDefault();
        const formData = new FormData(document.getElementById('orderForm'));
        const orderDetails = {
            menuOrder:menuId ,
            amountDiners: formData.get('numberOfDishes'),
            price:document.getElementById('totalPrice').textContent,
            dateEvent: formData.get('orderDate'),
            chefOrder:document.getElementById('chefName').textContent
            // dishes: Array.from(document.querySelectorAll('#dishesContainer input[type="checkbox"]:checked'))
            //     .map(checkbox => ({
            //         id: checkbox.id,
            //         price: parseFloat(checkbox.dataset.price)
            //     })),
            
        };

        try {
            const response = await fetch('http://localhost:8080/user/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(orderDetails)
            });
            if(!response.ok){
                 alert('Error placing order.');
                 throw new Error("!response.ok")
            }
            const result = await response.json();
               
            emailjs.init('YOUR_USER_ID'); // insert your user ID m-EmailJS


            // order private
            const templateParams = {
            to_email: result.e, // the chef's email address
            orderId: '12345', // ID order
            dateOrder: '2024-08-08', // order date
            dateEvent: '2024-08-10', // date date
            menuId: 'menu123', // menu ID
            quantity: '3', // quantity
            price: '50', // price
            };
            
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
            console.log('sent successfully:', response);
            }, function(error) {
            console.error('failed to send:'); })

                alert('Order placed successfully!');
                window.location.href='../html/privateArea.html'
           return result;
               
            
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    }

    document.getElementById('orderForm').addEventListener('change', (event) => {
        if (event.target.type === 'checkbox' || event.target.id === 'numberOfDishes') {
            calculateTotalPrice();
        }
    });

    document.getElementById('orderForm').addEventListener('submit', submitOrder);
});
