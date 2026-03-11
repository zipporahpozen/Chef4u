

function getQueryParam(id) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(id);
}
// Get menuId from URL
const chefId = getQueryParam('id');
const menuContainer = document.getElementById('menu-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const token = localStorage.getItem('token'); // קבלת הטוקן מה-localStorage
async function fetchMenus(chefId) {
    try { 
        let url
        if(chefId)
        url=`http://localhost:8080/chef/getMenu/${chefId}`
        else
        url='http://localhost:8080/chef/getMenu/'
        const response = await fetch(url,{
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching menus:', error);
        return [];
    }
}
async function InitialFetch() {
    const menus = await fetchMenus(chefId);
    renderMenus(menus);
}
// Function to render menus to the page
function renderMenus(menus) {
    menuContainer.innerHTML = '';
    
    if (menus.length === 0) {
        menuContainer.innerHTML = '<p>No more menus available</p>';
        return;
    } 
    menus.forEach(menu => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        
        // קריאת התפקיד מה-localStorage
        const userRole = localStorage.getItem('userRole');
        
        // יצירת הכפתור הקיים
        let orderButton = `<button onclick="orderMenu('${menu._id}')">Order Now</button>`;
        
        // אם המשתמש הוא chef, ניצור כפתור נוסף ונשנה את שם הכפתור הקיים
        if (userRole === 'chef') {
            orderButton = `
                <button onclick="updateMenu('${menu._id}')">Update Menu</button>
            `;
        }       
        menuItem.innerHTML = `
            <img src="${menu.image}" alt="${menu.name}">
            <div class="menu-details">
                <h3>${menu.name}</h3>
                <p>${menu.description}</p>
                <p>Chef: ${menu.creatorID.name}</p>
                <div>
                    ${menu.dishes.map(dish => `
                        <div class="dish">
                            <img src="${dish.image}" alt="${dish.name}">
                            <div>
                                <p>${dish.name}</p>
                                <p>$${dish.price}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${orderButton}
            </div>
        `;
        
        menuContainer.appendChild(menuItem);
    });

}
// Function to handle ordering a menu
function orderMenu(menuId) {
    // Redirect to the order page with menuId in the URL
    const url = new URL('addOrder.html', window.location.href);
    window.location.href = `${url}?menuId=${menuId}`;
}

function updateMenu(menuId) {
    const url = new URL('updateMenu.html', window.location.href);
    window.location.href = `${url}?menuId=${menuId}`;
}

InitialFetch()

