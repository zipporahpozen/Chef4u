import express from 'express';
const router = express.Router();
import menuModel from '../Model/menu.js';
import chefModel from '../Model/chef.js';
import {
    createMenuObject,
    saveMenu,
    updateChefMenu,
    updateMenuObject
} from '../Servies/menu.js';
async function addMenu(req, res){
    try {
      //  const image = req.body.path;
      const menu = createMenuObject(req.body,req.body.image,req.user._id);
      const savedMenu = await saveMenu(menu);
      await updateChefMenu(req.user._id, savedMenu._id);
      res.status(201).json(savedMenu);
    } catch (error) {
      console.error('Error adding menu:', error);
      res.status(500).send('Internal Server Error.');
    }
  };

  async function getChefByCreatorID(req,res) {
    try 
    {
     // מחפש את השף במסד הנתונים לפי ה-creatorID שניתן
    const chef = await chefModel.findById(req.params.id).exec();
     // אם לא נמצא שף עם ה-ID שניתן, זורק שגיאה
     if (!chef) 
     {
      res.status(403).send(`No chef found with creatorID ${req.body.id}`);
     }
     // מחזיר את פרטי השף
     res.status(200).send(chef);
    } 
    catch 
    {
        // אם יש שגיאה כלשהי, מדפיס את השגיאה וזורק אותה שוב
     console.error('Error fetching chef:', error.message);
     res.status(403).send(" error finding chef");
    }
}
async function getAllMenu(req, res) {
  try {
    // קריאת פרמטרים מהבקשה
    const page = parseInt(req.query.page, 10) || 1; // דף ברירת מחדל הוא 1
    const limit = parseInt(req.query.limit, 10) || 15; // כמות ברירת מחדל היא 15

    // חיפוש תפריטים עם status true
    const newMenus = await menuModel.find({ 'status': true });

    // בדיקה אם לא נמצאו תפריטים
    if (newMenus.length === 0) {
      return res.status(404).send('No menu found');
    }

    // מיון התפריטים לפי updateDate
    newMenus.sort((a, b) => {
      const aUpdateDate = a.updateDate ? new Date(a.updateDate) : new Date(0);
      const bUpdateDate = b.updateDate ? new Date(b.updateDate) : new Date(0);
      return bUpdateDate - aUpdateDate;
    });

    // חישוב אינדקסים להתחיל ולהפסיק את החיתוך
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // חיתוך התפריטים לפי העמוד המבוקש
    const paginatedMenus = newMenus.slice(startIndex, endIndex);

    // אם העמוד הנוכחי אינו קיים, לשלוח הודעת סיום
    if (paginatedMenus.length === 0 && page !== 1) {
      return res.status(404).send('No more menus available');
    }

    // שליחת התפריטים בתגובה
    res.status(200).json(paginatedMenus);
  } catch (error) {
    // טיפול בשגיאות
    res.status(500).send('Internal Server Error');
  }
}

async function updateMenu(req, res) {
  try {
    const menu = await menuModel.findById(req.params.id);
    const chef =await chefModel.findById(req.user._id);
    if (!menu) {
      return res.status(404).send('menu not found');
    }
    if (!chef) {
      return res.status(404).send('chef not found');
    }
    if (menu.creatorID.toString() !== chef._id.toString()) {
      return res.status(401).send('Access denied');
    }
     updateMenuObject(menu, req.body);
    if (req.file) {
      const { path: image } = req.file;
      menu.image = image;
    }
    const updatedMenu = await saveMenu(menu);
    res.json(updatedMenu);
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).send('Internal Server Error.');
  }
}
async function deleteMenu(req, res) {
  try{
    console.log(req.params)
    const menu = await menuModel.findById(req.params.id);
    console.log(req.user)
    const chef =await chefModel.findById(req.user._id);
    if (!menu) {
      return res.status(404).send('menu not found');
    }
    if (!chef) {
      return res.status(404).send('chef not found');
    }
    console.log(menu.creatorID,chef._id)
    if (menu.creatorID.toString() !== chef._id.toString()) {
      return res.status(401).send('Access denied');
    }
    menu.status=false;
    console.log(menu)
    await saveMenu(menu);
    return res.status(200).send('the menu deleted')
  }
  catch{
   return res.status(500).send("error delete menu");
  }
}

async function getMenuById (req, res) 
{
  try {
    const menu = await menuModel.findById(req.params.id).exec();
    res.json(menu);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

export{
    addMenu,
    getAllMenu,
    getChefByCreatorID,
    updateMenu,
    deleteMenu,
    getMenuById
}