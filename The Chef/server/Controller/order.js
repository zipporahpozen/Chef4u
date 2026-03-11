
import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import orderModel from '../Model/order.js';
import chefModel from '../Model/chef.js';
import userModel from '../Model/user.js';
import menuModel from '../Model/menu.js';
import{
    createOrderObject,
    saveOrder,
    updateUserOrder
}from '../Servies/order.js';

async function addOrder(req, res){
    try {
      const order = createOrderObject(req.body,req.user._id);
      const savedOrder = await saveOrder(order);
      await updateUserOrder(req.user._id, savedOrder._id);
      const chefemail=await chefModel.findById(req.body.chefOrder)
      console.log(chefemail)
      res.status(201).send({savedOrder,chefemail});
    } catch (error) {
      console.error('Error adding menu:', error);
      res.status(500).send('Internal Server Error.');
    }
  };
  async function getAllOrdersByChef(req, res) {
    try {
        // קבלת ה- chefId מהפרמטרים בכתובת ה-URL
        const chefId = req.user._id;
        // לוודא שה- chefId לא ריק
        if (!chefId) {
            return res.status(400).json({ message: 'Chef ID is required' });
        }        // חיפוש כל ההזמנות של השף
        const orders = await orderModel.find({ chefOrder: chefId });
        // אם לא נמצאו הזמנות
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this chef' });
        }
        orders.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        // החזרת ההזמנות בהצלחה
        res.status(200).json(orders);
    } catch (error) {
        // טיפול בשגיאות
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function approvalOrder(req, res)
{
   
   const order=await orderModel.findById(req.params.id)
    console.log(order)
    try
    {
       if(order)
       {
           order.status=true;
           const orderr= await saveOrder(order);
          return res.status(200).send(orderr)
       }
     }
   catch{
   return res.status(403).send("order not found");
  }
}

  export{
    addOrder,
    getAllOrdersByChef,
    approvalOrder
  }
export default router;