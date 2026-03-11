import express from 'express';
 import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();
import user from '../server/Route/user.js';
import chef from '../server/Route/chef.js';
import menu from '../server/Route/menu.js'                  
import db from './DB/MongoConnect.js';
import { authenticate} from './MiddleWare/middle.js';
import { approvalChef } from './Controller/chef.js';
import multer from 'multer'
const upload = multer({ 
    dest: 'uploads/', 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
const app = express();
const port = 8080;
// תומך ב-JSON ו-urlencoded עם מגבלת גודל
app.use(express.json());
app.use(express.urlencoded({  extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use("/user",user);
app.use("/chef",chef);
app.use("/menu",menu);
app.post("/admin/approve/:id",authenticate,async(req,res)=>
    { 
       try{
        const chef=await approvalChef(req,res);
        res.status(200).send(chef)
       } 
       catch(error){
        res.status(500).send('Intenal server error.')
       }
    });
app.listen(port, () => {console.log(`Example app listening on port ${port}`)});