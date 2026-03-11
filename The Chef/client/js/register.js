function toggleChefFields() {
    var isChef = document.getElementById('isChef').checked;
    var chefFields = document.getElementById('chefFields');
    if (isChef) {
        chefFields.classList.add('show');
    } else {
        chefFields.classList.remove('show');
    }
}async function register() {
    const email = document.querySelector("#email").value;
    const pass = document.querySelector("#password").value;
    const name = document.querySelector("#Username").value;
    const isChef = document.querySelector("#isChef").checked; 
    const description = document.querySelector("#description") ? document.querySelector("#description").value : null;
    const imageUpload = document.querySelector("#imageUpload") ? document.querySelector("#imageUpload").files[0] : null;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    function validateEmail() {
        const email = emailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = 'Invalid email address';
        } else {
            emailError.textContent = '';
        }
    }
    function validatePassword() {
        const passw = passwordInput.value;
        const lengthCheck = passw.length >= 8;
        const numberCheck = /[0-9]/.test(passw);
        const letterCheck = /[a-zA-Z]/.test(passw);
        const specialCharCheck = /[!@#$%^&*]/.test(passw);

        if (lengthCheck && numberCheck && letterCheck && specialCharCheck) {
            passwordError.textContent = 'Password is strong';
            passwordError.classList.add('valid');
            passwordError.classList.remove('error');
            return true
        } else {
            passwordError.textContent = 'Password must be at least 8 characters long, include a number, a letter, and a special character';
            passwordError.classList.add('error');
            passwordError.classList.remove('valid');
            return false
        }
    }
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
  
    // async function encryptPassword(password) {
    //     const saltRounds = 10;
    //     try {
    //         const hash = await new Promise((resolve, reject) => {
    //             bcrypt.hash(password, saltRounds, (err, hash) => {
    //                 if (err) reject(err);
    //                 resolve(hash);
    //             });
    //         });
    //         console.log('Encrypted Password:', hash);
    //         return hash;
    //     } catch (error) {
    //         console.error('Error encrypting password:', error);
    //     }
    // }

    // (async function() {
    //     const password =
    //     await encryptPassword(pass);
    // })();
    const formData=new FormData();
    formData.append('email',email)
    formData.append('password',pass)
    formData.append('name',name)
    formData.append('description',description)
    if (imageUpload){
        formData.append('image',imageUpload)
    }
    const settings = {
        method: "POST",
        body: formData
    };

    const url = isChef ? "http://localhost:8080/chef/register" : "http://localhost:8080/user/register";
    try {
        if(!validatePassword(pass))
            {
            throw new Error();
            }

        const response = await fetch(url, settings);
        if (!response.ok) {
            if (response.status === 400) {
                alert("ישנן שגיאות בטופס שלך. אנא בדוק את הערכים והנסה שוב.");
            } else if (response.status === 409) {
                alert("האימייל כבר קיים במערכת. נסה אימייל אחר.");
            } else {
                throw new Error(`שגיאה: ${response.statusText}`);
            }
            return;
        }
        if(!isChef)
        {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("userRole", data.role);
        
        sendEmail(data.user.email, data.user.name);
        window.location.href = "../html/home.html";
        return data.user;
        }
        else{
            alert("המתן לאישור מנהל")
        }
        window.location.href = "../html/home.html";
        return true;
    } catch (error) {
        console.error("Error:", error);
        alert("אירעה שגיאה. אנא נסה שוב מאוחר יותר.");
        throw error; 
    }
}

function sendEmail(userEmail, firstName) {
    emailjs.init('5D5oUiB9jpvMBzkEY');
    emailjs.send('service_08zw80n', 'template_gjmxv45', {
        userEmail: userEmail,    // שדה זה צריך להתאים לשם השדה בתבנית EmailJS
        firstName: firstName     // שדה זה צריך להתאים לשם השדה בתבנית EmailJS
    })
    .then(function(response) {
        console.log("Success:", response);
    }, function(error) {
        console.log("Failed:", error);
    });
}

