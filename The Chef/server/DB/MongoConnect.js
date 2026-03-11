import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectToDatabase = async () => {
  try {
    
    await mongoose.connect(process.env.DATABASE_URL, { });
    console.log("MongoDB connected");
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // יציאה מהתוכנית במקרה של שגיאה
  }
};

connectToDatabase();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

export default db;
