import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import orderModel from '../Model/order.js';
import chefModel from '../Model/chef.js';
import userModel from '../Model/user.js';
import menuModel from '../Model/menu.js';


export {
    createOrderObject,
    saveOrder,
    updateUserOrder

};
 
function createOrderObject(requestBody,userId) {
   const menu=menuModel.findById(requestBody.menuOrder)
    const order = new orderModel({
        dateOrder: Date.now(),
        dateEvent: requestBody.dateEvent,
        menuOrder: requestBody.menuOrder,
        chefOrder: chefModel.findById(menu)._id,
        price: requestBody.price,
        userID:userId,
        status: true,
        amountDiners: requestBody.amountDiners
});
return order;
}
async function saveOrder(order) {
const savedOrder = await order.save();
return savedOrder;
}

async function updateUserOrder(userID, orderId) {
try {
    const result = await userModel.updateOne(
        { _id: userID },
        {
            $push: {
                myOrder: orderId
            }
        }
    );
    if (result.matchedCount === 0) {
        console.log('User not found');
        throw new Error('User not found');
    }
    if (result.modifiedCount === 0) {
        console.log('User found but no changes were made');
    }
} catch (error) {
    console.error('Error updating user:', error);
    throw error;
}
}




