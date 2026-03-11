import express from 'express';
import validator from 'validator';
const router = express.Router();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import jwt from 'jsonwebtoken';
import menuModel from '../Model/menu.js';
import chefModel from '../Model/chef.js';

 
function createMenuObject(requestBody, image,chefId) {
        const menu = new menuModel({
        name: requestBody.name,
        category: requestBody.category,
        typeKitchen: requestBody.typeKitchen,
        dishes: requestBody.dishes,
        description: requestBody.description,
        updateDate:requestBody.updateDate,
        image: image,
        creatorID: chefId
    });
    return menu;
}
async function saveMenu(menu) {
    const savedMenu = await menu.save();
    return savedMenu;
}

async function updateChefMenu(chefId, menuId) {
    try {
        const result = await chefModel.updateOne(
            { _id: chefId },
            {
                $push: {
                    myMenu: menuId
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


function updateMenuObject(menu,requestBody) {
    
    menu.name= requestBody.name,
    menu.category= requestBody.category,
    menu.typeKitchen=requestBody.typeKitchen,
    menu.dishes=requestBody.dishes,
    menu.description= requestBody.description,
    menu.updateDate=Date.now()
}
export{
    createMenuObject,
    saveMenu,
    updateChefMenu,updateMenuObject

}