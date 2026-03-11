import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
// const ObjectId = mongoose.Types.ObjectId;
import jwt from 'jsonwebtoken';
import chefModel from '../Model/chef.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
function extractChefDataFromRequest(req) {
    const { name, password, email, description,  phone, category} = req.body;
    const image = req.file ? req.file.path : 'no-image'; // נתיב הקובץ המועלה
    return {
        name,
        password,
        email,
        description,
        image,
        galery: [],
        phone,
        category,
        typeKitchen: [],
        followers: [],
        myMenu:[]
    };
}


async function createChef(chefData) {
    return new chefModel(chefData);
}

function handleError(error, res) {
    if (error.code === 11000) {
        const duplicateFields = Object.keys(error.keyValue).join(', ');
        console.error(`Error saving chef: Duplicate key error for fields: ${duplicateFields}`);
        return res.status(400).send(`Duplicate key error for fields: ${duplicateFields}`);
    }
     else {
        console.error('Error saving chef:', error);
        return res.status(500).send('Internal Server Error.');
    }
}

async function saveChef(chef) {
    return await chef.save();
}

function handleChefNotFound(res) {
    return res.status(404).send('Chef not found.');
}
function validatePassword(chef, password) {
    return chef.password === password;
}
async function findChefByEmail(email) {
    return chefModel.findOne({ email });
}

async function findChefById(_id) {
    return chefModel.findOne({_id });
}
function generateToken(id, email, name) {
    const secretKey = process.env.SECRET_KEY; // חשוב להחזיק את המפתח הסודי בסביבה מאובטחת
    const payload = {
        '_id': id,
        'email': email,
        'name': name
    };
    const options = {
        expiresIn: '1h' // הגדרת תוקף של שעה אחת, ניתן לשנות לפי הצורך
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
}

 
function updateChefObject(chef,requestBody) {
    chef.password=requestBody.password,
    chef.email=requestBody.email,
    chef.image=requestBody.image,
    chef.galery=requestBody.galery,
    chef.phone=requestBody.phone,
    chef.name= requestBody.name,
    chef.category= requestBody.category,
    chef.typeKitchen=requestBody.typeKitchen,
    chef.description= requestBody.description
}


export {
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
};