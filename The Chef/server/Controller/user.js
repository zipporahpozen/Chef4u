
import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import userModel from '../Model/user.js';
import bcrypt from 'bcrypt'
import{
    extractUserDataFromRequest,
    createUser,
    handleError,
    saveUser,
    handleUserNotFound,
    findUserByEmail,
    findUserById,
    generateToken,
    sendUpdateToken
}from '../Servies/user.js'
import { findChefById } from '../Servies/chef.js';
import chefModel from '../Model/chef.js';


//פונקציה המחזירה את כל המשתמשים במערכת
 async function getAllUser(req,res){
  try{
      const userList=await userModel.find({});
      res.status(200).json(userList);
  }
  catch(error){
      res.status(500).json({ message: 'לא נמצאו לקוחות' });
  }
}
async function getUserById(req,res) {
  try{ 
    const user=await findUserById(req.user._id)
    if(!user){
     
     return res.status(403).send("user nor found")
    }
   return res.status(200).send(user)
  }catch{
    return res.status(500).send("server error")} 
}
async function addUser(req, res) {
  try {
    const userData = extractUserDataFromRequest(req);
    const user = await createUser(userData);
    const saveUse=await saveUser(user);
    login(req, res);
  } catch (error) {
    handleError(error, res);
  }
}

async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await findUserByEmail(email);
    if (!user) {
      return handleUserNotFound(res);
    }
// // אימות הסיסמה
// bcrypt.compare(password, user.password, (err, isMatch) => {
//   if (err) 
//     return res.status(500).send({ message: 'Error' });
//   if (!isMatch) {
//       res.status(401).send({ message: 'Invalid credentials' });
//   }
// });

    const token = generateToken(user._id, email, user.name);
    res.user = user;
    let role='user'
    if(password==process.env.SECRET_KEY){
       role='admin'
    }
    return res.json({ token, user,role });
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).send(error);
  }
}
async function addAsFollowToChef(req, res) {
  try {
      // הנחה שהמיילים הם חלק מהאובייקטים הנמצאים במסד הנתונים
      const userId = req.user._id; // מזהה המשתמש המחובר
      const chefId = req.params.id; // מזהה השף הנבחר
      console.log(chefId)
      console.log(req.params)
      // חפש את המשתמש לפי המזהה
      const user = await findUserById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      // חפש את השף לפי המזהה
      const chef = await findChefById(chefId);
      if (!chef) {
          return res.status(404).send('Chef not found');
      }
      // הוסף את מייל השף למערך myChef של המשתמש
      if (!user.myChef.includes(chef._id)) {
          user.myChef.push(chef._id);
      }
      // הוסף את מייל המשתמש למערך followers של השף
      if (!chef.followers.includes(user._id)) {
          chef.followers.push(user._id);
      }
      // שמור את השינויים במסד הנתונים
      await user.save();
      await chef.save();
      // החזר תגובה מוצלחת
      return res.status(200).send(chef);
  } catch (error) {
      // הדפס שגיאות לקונסול והחזר תגובת שגיאה
      console.error(error);
      return res.status(500).send('Error occurred while following the chef');
  }
} 

async function updateUser(req,res) {
  try{
   const user=await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
  if(!user){
    res.status(403).send("user was not found")
  }
  await sendUpdateToken(req,res);
}catch{
  res.status(500).send("server error")
}}
export
{
  getAllUser,
  addUser,
  login,
  addAsFollowToChef,
  updateUser,
  getUserById
}
export default router;
