import express from 'express';
const router = express.Router();
import chefModel from '../Model/chef.js';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import{
    extractChefDataFromRequest,
    createChef,
    handleError,
    saveChef,
    handleChefNotFound,
    validatePassword,
    findChefByEmail,
    generateToken,
    findChefById,
    updateChefObject

} from '../Servies/chef.js';
import menuModel from '../Model/menu.js';

async function getChefById(req,res) {
try{
   const chef= await findChefById(req.user._id)
   if(!chef){
    res.status(403).send(" chef not found")
   }
    res.status(200).send(chef)
}catch{
  res.status(500).send('server error')
}  
}
async function addChef(req, res)
{
  try {
    const chefData = extractChefDataFromRequest(req);
    const chef = await createChef(chefData);
    const fchef=await saveChef(chef);
    res.status(200).send( 'admin approval is required');
  } catch (error) {
    handleError(error, res);
  }
}
async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const chef = await findChefByEmail(email);
    if (!chef) {
      return handleChefNotFound(res);
    }

    if (!validatePassword(chef, password)) {
      return res.status(405).send('The password is wrong');
    }
   if(!chef.isApproved)
    {
      return res.status(403).send('admin approval is required');
   }
    const token = generateToken(chef._id, email, chef.name);
    res.chef = chef;
    let role='chef'
    return res.json({ token, chef,role});
  } catch (error) {
    console.error('Error finding chef:', error);
    return res.status(500).send(error);
  }
}
async function getAllMyMenu(req, res){
  console.log(req)
  console.log(req.params)
  let chefId
  if(req.params.id!=undefined){
     chefId=req.params.id;
  }  
  else
  {
    console.log(req)
    console.log(req.user)
    console.log(req.user._id)
      chefId=req.user._id;
    }
  const chef=await findChefById(chefId);
  const menus = chef.myMenu;
   // קבלת המערך של IDs מהגוף של הבקשה (request body)
  if (!Array.isArray(menus) || menus.length === 0) {
    return res.status(400).send('Invalid or empty IDs array');
  }
  try {
    console.log(menus)
    // מציאת התפריטים עם ה-IDs שנמסרו וסטטוס שווה ל-true
    const newMenus = await menuModel.find({
      '_id': { $in: menus },
     'status': true // תנאי נוסף שמוודא שהסטטוס הוא true
    });
    newMenus.sort((a, b) => b.updateDate - a.dateAddToChef);
    // החזרת התפריטים בתגובה
    return res.status(200).send( newMenus);
  } catch (error) {
    // טיפול בשגיאות
    console.error('Error fetching menus:', error);
    res.status(500).send( 'Server Error');
  }
};

async function getApprovalChef(req, res) {
  try {
    
    // שליפת השפים עם סטטוס false
    const chefs = await chefModel.find({ isApproved: false });

    // החזרת התוצאה ב-JSON
    res.json(chefs);
  } catch (error) {
    console.error('Error fetching chefs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function approvalChef(req, res)
{ 
   const chef=await chefModel.findById(req.params.id)
    console.log(chef)
    try
    {
       if(chef)
       {
           chef.isApproved=true;
           const saveChe= await saveChef(chef);
           res.status(200).send(saveChe)
       }
     }
   catch{
   return handleChefNotFound(res);
  }
}

async function updateChef(req, res) {
  try {
    const chef =await chefModel.findById(req.user._id);
    if (!chef) {
      return res.status(404).send('chef not found');
    }
    updateChefObject(chef, req.body);
    if (req.file) {
      const { path: image } = req.file;
      menu.image = image;
    }
    const updatedChef = await saveChef(chef);
    res.status(200).send(updatedChef);
  } catch (error) {
    console.error('Error updating chef:', error);
    res.status(500).send('Internal Server Error.');
  }
}

async function deleteChef(req, res) 
{
  try{
    console.log(req.user._id)
  const chef=await findChefById(req.user._id);
  if(!chef)
  {
   res.status(403).send('chef wasnt found')
  }
  console.log(chef,chef.myMenu )
  for(let i=0 ;i<chef.myMenu.length;i++)
  {
    console.log(chef.myMenu[i])
   const menu=await menuModel.findById(chef.myMenu[i])
   console.log(menu)
   menu.status=false;
   await menuModel.saveMenu(menu);
  }
  console.log(chef)
  chef.status=false;
  console.log('vcghhhhh')
  const savechef=await saveChef(chef);
  res.status(200).send("chef deleted.")
  }
  catch
  {
  res.status(500).send('error delete chef')
  }
}
async function getAllChef(req, res) {
  try {
      // חפש שפים שהסטטוס שלהם הוא true, מיין לפי מספר העוקבים וגבול את התוצאה ל-9
      const chef = await chefModel.find({ isApproved: true ,status: true}) // חפש רק שפים עם סטטוס true
        .sort({ 'followers.length': -1 }) // סדר לפי מספר העוקבים יורד
        .limit(9); // גבול את התוצאה ל-9
      res.status(200).send(chef);
  } catch (error) {
      console.error('Error fetching top chef:', error);
      res.status(500).send({ message: 'Server error' });
  }
}
export{
  addChef,
  login,
  approvalChef,
  getAllMyMenu,
  updateChef,
  deleteChef,
  getAllChef,
  getApprovalChef,
  getChefById
}
export default router;
