document.addEventListener('DOMContentLoaded', () => {
    async function displayUserInfo() {
    //    קבלת סוג המשתמש מ-localStorage
    const userType = localStorage.getItem('userRole');
    const userData= await fetchDetails() 

      // הסתרת כל המידע
      document.querySelectorAll('.user-info').forEach(div => div.style.display = 'none');
  
      // יצירת קישורים דינמיים
      const navLinks = document.getElementById('navLinks');
      let linksHTML = '';
      switch (userType) {
        case 'chef':
          document.getElementById('chefInfo').style.display = 'block';
          document.getElementById('chefName').textContent = userData.name || 'N/A';
          document.getElementById('chefEmail').textContent = userData.email || 'N/A';
          document.getElementById('chefDescription').textContent = userData.description || 'N/A';
          document.getElementById('chefCategory').textContent = userData.category || 'N/A';
          document.getElementById('chefTypeKitchen').textContent = userData.typeKitchen.join(', ') || 'N/A';
          document.getElementById('chefStatus').textContent = userData.status ? 'Active' : 'Inactive';
          document.getElementById('chefFollowersCount').textContent = userData.followers.length || 0;
          document.getElementById('chefMenuCount').textContent = userData.myMenu.length || 0;
          document.getElementById('chefImage').src = userData.image || 'default-image.jpg';
          linksHTML +='<a href="../html/chefOrder.html">oreders</a><a href="../html/chefUpdate.html">Update/Delete</a>'
          // הצגת גלריית התמונות
        //   const gallery = document.getElementById('chefGallery');
        //   gallery.innerHTML = userData.galery.map(imageUrl => `
        //     <img src="${imageUrl}" alt="Chef Gallery Image">
        //   `).join('');
          
        //   linksHTML += '<a href="orders.html">Orders</a><a href="menu.html">Menu</a>';
        //   document.getElementById('galleryButton').addEventListener('click', () => {
        //     fetch('/api/gallery') // קריאת שרת לגלריה
        //       .then(response => response.json())
        //       .then(data => {
        //         const gallery = document.getElementById('chefGallery');
        //         gallery.innerHTML = data.map(imageUrl => `
        //           <img src="${imageUrl}" alt="Chef Gallery Image">
        //         `).join('');
        //       });
        //   });
          break;
          
        case 'admin':
          document.getElementById('adminInfo').style.display = 'block';
          document.getElementById('adminName').textContent = userData.name || 'N/A';
          document.getElementById('adminEmail').textContent = userData.email || 'N/A';
          document.getElementById('adminMyChefsCount').textContent = userData.myChef.length || 0;
          document.getElementById('adminMyOrdersCount').textContent = userData.myOrder.length || 0;
  
          linksHTML += '<a href="../html/approvalChef.html">approvalChef</a>';
          break;
  
        case 'user':
          document.getElementById('customerInfo').style.display = 'block';
          document.getElementById('customerName').textContent = userData.name || 'N/A';
          document.getElementById('customerEmail').textContent = userData.email || 'N/A';
          document.getElementById('customerMyChefsCount').textContent = userData.myChef.length || 0;
          document.getElementById('customerMyOrdersCount').textContent = userData.myOrder.length || 0;
  
          // linksHTML += '<a href="orders.html">Orders</a>';
          break;
  
        default:
          document.getElementById('chefInfo').style.display = 'none';
          document.getElementById('adminInfo').style.display = 'none';
          document.getElementById('customerInfo').style.display = 'none';
          break;
      }
      
      navLinks.innerHTML = linksHTML;
    }
  
    displayUserInfo();
  });
  async function fetchDetails() {
        const token=localStorage.getItem('token')
        let role=localStorage.getItem('userRole')
        if (role=='admin'){role='user'}
        try {
            const response = await fetch(`http://localhost:8080/${role}/getById`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // הוספת הטוקן לכותרות הבקשה
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const User = await response.json();
           return User
        } catch (error) {
            console.error('Error:', error);
            alert('אירעה שגיאה בזיהוי משתמש.');
        }
        
    }
  