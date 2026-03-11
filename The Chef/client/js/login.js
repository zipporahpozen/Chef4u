
async function login() {
    console.log("login");

    // קבלת הערכים מהשדות
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const name = document.querySelector("#Username").value;
    const isChef = document.querySelector("#isChef").checked; // השתמש ב-checked עבור checkbox
   
// // הצפנת סיסמה בצד הלקוח
// async function encryptPassword(password) {
//     // יצירת salt ו-hash של הסיסמה
//     const saltRounds = 10; // מספר הסבבים
//     return new Promise((resolve, reject) => {
//         bcrypt.hash(password, saltRounds, function(err, hash) {
//             if (err) reject(err);
//             resolve(hash);
//         });
//     });
 
//   }
//  const password=encryptPassword(pass)
    // הגדרת פרמטרי הבקשה
    const settings = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name
        })
    };

    // קביעת ה-URL של השרת בהתאם לסוג המשתמש
    const url = isChef ? "http://localhost:8080/chef/login" : "http://localhost:8080/user/login";

    try {

        // שליחת הבקשה
        const response = await fetch(url, settings);
        console.log(response);

        // בדיקת מצב התגובה
        if (!response.ok) {
            console.log(response);
            console.log(response.statusText);

            // טיפול בשגיאות לפי קוד הסטטוס
            if (response.status === 401) {
                alert("סיסמה שגויה");
            } else if (response.status === 404) {
                alert("לא נמצא משתמש עבור האימייל שהוקש, נסה שוב!");
            } else {
                throw new Error(`שגיאה: ${response.statusText}`);
            }
            return;
        }

        const data = await response.json();
        console.log(data);
        console.log(data.token);
        localStorage.setItem("token", data.token);
        let role=isChef ? data.chef.name :data.user.name
        localStorage.setItem("name", role);
        localStorage.setItem('userRole', data.role); // יכול להיות 'admin' או 'user'
        window.location.href = "../html/home.html";
        return data.user;
    } catch (error) {
        console.error("Error:", error);
        alert("אירעה שגיאה. אנא נסה שוב מאוחר יותר.");
        throw error; // זרוק את השגיאה למי שקורא לפונקציה אם יש צורך
    }
}
