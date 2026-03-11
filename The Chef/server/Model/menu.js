import mongoose from 'mongoose';
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // חובה להזין שם פריט
    default: 'Unnamed Item' // ערך ברירת מחדל אם השם לא מסופק
  },
  category: {
    type: String,
    default: 'General' // ערך ברירת מחדל אם הקטגוריה לא מסופקת
  },
  price: {
    type: Number,
    required: true, // חובה להזין מחיר
    min: [0, 'Price cannot be negative'] // מחיר לא יכול להיות שלילי
  },
  image: {
    type: String,
    default: 'default-image-url' // ערך ברירת מחדל אם כתובת התמונה לא מסופקת
  }
});
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // חובה להזין שם תפריט
  },
  category: {
    type: String,
    default: 'General' // ערך ברירת מחדל אם הקטגוריה לא מסופקת
  },
  typeKitchen: {
    type: String,
    default: 'Unknown' // ערך ברירת מחדל אם סוג המטבח לא מסופק
  },
  dishes: {
    type: [menuItemSchema],
    default: [] // ערך ברירת מחדל הוא רשימה ריקה אם לא סופקו מנות
  },
  description: {
    type: String,
    default: 'No description provided' // ערך ברירת מחדל אם תיאור לא מסופק
  },
  updateDate: {
    type: Date,
    default: Date.now // ערך ברירת מחדל הוא התאריך הנוכחי
  },
  image: {
    type: String,
    default: 'default-menu-image-url' // ערך ברירת מחדל אם כתובת התמונה לא מסופקת
  },
  creatorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef'
  },
  status: {
    type: Boolean,
    default: true // ערך ברירת מחדל הוא true, תפריט פעיל
  }
});
  
const menuModel = mongoose.model('menuModel', menuSchema);
export default menuModel;
  