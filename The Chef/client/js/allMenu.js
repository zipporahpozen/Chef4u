const menuContainer = document.getElementById('menu-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

let currentPage = 1;
const limit = 15;
let totalMenus = 0; // This will be updated with the total number of menus from the server

// Function to fetch menus from the server
async function fetchMenus(page) {
    try {
        const response = await fetch(`http://localhost:8080/menu/?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Assuming the data is an array of menu items
        return data;
    } catch (error) {
        console.error('Error fetching menus:', error);
        return [];
    }
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
                <button onclick="orderMenu('${menu._id}')">Order Now</button>
            </div>
        `;
        
        menuContainer.appendChild(menuItem);
    });
}

// Function to handle page changes
async function handlePageChange() {
    const menus = await fetchMenus(currentPage);
    renderMenus(menus);
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = (currentPage * limit) >= totalMenus; // Update totalMenus from the server or response
}

// Function to handle ordering a menu
function orderMenu(menuId) {
    // Redirect to the order page with menuId in the URL
    const url = new URL('addOrder.html', window.location.href);
    window.location.href = `${url}?menuId=${menuId}`;
}

// Event listeners for pagination buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        handlePageChange();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    handlePageChange();
});

// Initial fetch
handlePageChange();


// const menuContainer = document.getElementById('menu-container');
// const prevButton = document.getElementById('prev-button');
// const nextButton = document.getElementById('next-button');

// let currentPage = 1;
// const limit = 15;
// let totalMenus = 0; // This will be updated with the total number of menus from the server

// // Function to fetch menus from the server
// async function fetchMenus(page) {
//     try {
//         const response = await fetch(`http://localhost:8080/menu/?page=${page}&limit=${limit}`);
//         if(!response.ok){
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
        
//         // Assuming the data is an array of menu items
//         return data;
//     } catch (error) {
//         console.error('Error fetching menus:', error);
//         return [];
//     }
// }

// // Function to render menus to the page
// function renderMenus(menus) {
//     menuContainer.innerHTML = '';
    
//     if (menus.length === 0) {
//         menuContainer.innerHTML = '<p>No more menus available</p>';
//         return;
//     }

//     menus.forEach(menu => {
//         const menuItem = document.createElement('div');
//         menuItem.classList.add('menu-item');
        
//         menuItem.innerHTML = `
//             <img src="${menu.image}" alt="${menu.name}">
//             <div class="menu-details">
//                 <h3>${menu.name}</h3>
//                 <p>${menu.description}</p>
//                 <p>Chef: ${menu.creatorID.name}</p>
//                 <div>
//                     ${menu.dishes.map(dish => `
//                         <div class="dish">
//                             <img src="${dish.image}" alt="${dish.name}">
//                             <div>
//                                 <p>${dish.name}</p>
//                                 <p>$${dish.price}</p>
//                             </div>
//                         </div>
//                     `).join('')}
//                 </div>
//                 <button onclick="orderMenu('${menu._id}', '${menu.name}', '${menu.creatorID.name}', '${menu.description}')">Order Now</button>
//             </div>
//         `;
        
//         menuContainer.appendChild(menuItem);
//     });
// }

// // Function to handle page changes
// async function handlePageChange() {
//     const menus = await fetchMenus(currentPage);
//     renderMenus(menus);
//     prevButton.disabled = currentPage === 1;
//     nextButton.disabled = (currentPage * limit) >= totalMenus; // Update totalMenus from the server or response
// }

// // Function to handle ordering a menu
// function orderMenu(menuId, menuName, chefName, description) {
//     // Redirect to the order form page with query parameters
//     const url = new URL('addOrder.html', window.location.href);
//     console.log(url.toString());
//     console.log(window.location);
//     url.searchParams.append('menuId', menuId);
//     url.searchParams.append('menuName', encodeURIComponent(menuName));
//     url.searchParams.append('chefName', encodeURIComponent(chefName));
//     url.searchParams.append('description', encodeURIComponent(description));
    
//     window.location.href = url.toString();
// }

// // Event listeners for pagination buttons
// prevButton.addEventListener('click', () => {
//     if (currentPage > 1) {
//         currentPage--;
//         handlePageChange();
//     }
// });

// nextButton.addEventListener('click', () => {
//     currentPage++;
//     handlePageChange();
// });

// // Initial fetch
// handlePageChange();
