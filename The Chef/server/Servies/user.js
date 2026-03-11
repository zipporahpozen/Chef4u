
import express from 'express';
import validator from 'validator';
const router = express.Router();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import jwt from 'jsonwebtoken';
import userModel from '../Model/user.js';

export {
    validateUserName,
    extractUserDataFromRequest,
    createUser,
    handleError,
    saveUser,
    handleUserNotFound,
    findUserByEmail,
    findUserById,
    generateToken,
    sendUpdateToken
};
function validateUserName(userName) {
    if (!userName) {
        throw new Error('לא סופק שם משתמש');
    }
}


function extractUserDataFromRequest(req) {
        const { name, password, email } = req.body;
        return {
            name,
            password,
            email,
            myChef: [],
            myOrder: []
        };
    }
    
    async function createUser(userData) {
        return new userModel(userData);
    }
    function handleError(error, res) {
        if (error.code === 11000) {
            const duplicateFields = Object.keys(error.keyValue).join(', ');
            console.error(`Error saving user: Duplicate key error for fields: ${duplicateFields}`);
            return res.status(400).send(`Duplicate key error for fields: ${duplicateFields}`);
        }
         else {
            console.error('Error saving user:', error);
            return res.status(500).send('Internal Server Error.');
        }
    }
    
    async function saveUser(user) {
        return await user.save();
    }
    function handleUserNotFound(res) {
        return res.status(404).send('User not found.');
    }

    async function findUserByEmail(email) {
        return userModel.findOne({ email });
    }
    async function findUserById(_id) {
        console.log(_id)
        return await userModel.findOne({ _id });
    }
    function generateToken(id, email, name) {
        const secretKey = process.env.SECRET_KEY;// חשוב להחזיק את המפתח הסודי בסביבה מאובטחת
      
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
    
async function sendUpdateToken(req, res) {
    try {
        const token = generateToken(req.user._id, req.body.email, req.body.name);
        return res.status(200).send({ token:token, user: req.body });
    } catch (error) {
        return handleServerError(error, res);
    }
}