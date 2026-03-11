import multer from 'multer';
import path from 'path';

// הגדרת ה-storage של multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');  // התיקייה שבה יאוחסנו הקבצים
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // יצירת שם ייחודי לכל קובץ
  }
});

// הגדרת multer עם ה-storage שנבחר
const upload = multer({ storage: storage });

export default upload;