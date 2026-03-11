document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

async function fetchOrders() {
    try {
        const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
        const response = await fetch('http://localhost:8080/chef/myOrder' ,{
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function renderOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        
        orderCard.innerHTML = `
            <h2>Order #${order._id}</h2>
            <div class="order-details">
                <p><span>Order Date:</span> ${new Date(order.dateOrder).toLocaleDateString()}</p>
                <p><span>Event Date:</span> ${new Date(order.dateEvent).toLocaleDateString()}</p>
                <p><span>Guests:</span> ${order.amountDiners}</p>
                <p><span>Menu:</span> ${order.menuOrder}</p>
                 <p><span>Total Price:</span> ${order.price}</p>
                <p class="order-status ${order.status ? '' : 'inactive'}">
                    Status: ${order.status ? 'Active' : 'Inactive'}
                </p>
            </div>
            <button class="approve-button" data-order-id="${order._id}">Order Confirmation</button>
        `;
        
        ordersContainer.appendChild(orderCard);
    });

    // Attach event listener to dynamically created buttons
    document.querySelectorAll('.approve-button').forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-order-id');
            fetchOrderDetails(orderId);
        });
    });
}

async function fetchOrderDetails(orderId) {
    try {
        const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
        const response = await fetch(`http://localhost:8080/chef/approval/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const orderDetails = await response.json();
        alert(`order ${orderDetails._id} approved successfully!`);
        location.reload(); // לטעון מחדש את הדף לאחר ההצלחה
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

