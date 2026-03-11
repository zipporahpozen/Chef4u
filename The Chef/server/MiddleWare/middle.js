import jwt from 'jsonwebtoken';

const authenticate = async (req, res, next) => {
    // קבלת טוקן מהכותרת Authorization
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    try {
        // אימות ופענוח הטוקן
        const decoded = jwt.verify(token, process.env.SECRET_KEY );
        const { _id, email, name } = decoded;
         // הוספת מידע למשתמש לבקשה
        req.user = { _id, email, name };
        next(); // מעבר ל-Middleware הבא או לנתיב היעד
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};
export{
    authenticate
};
