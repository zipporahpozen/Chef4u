import express from 'express';
const router = express.Router();
import * as Chef from '../Controller/chef.js';
import {authenticate} from '../MiddleWare/middle.js';
import * as menu from '../Controller/menu.js';
import * as order from '../Controller/order.js';
import multer from "multer";
// const upload = multer({ dest: 'uploads/' });
import upload from '../MiddleWare/upload.js';
const app = express();


router.post("/register", upload.single('image'),Chef.addChef);
router.post("/login",Chef.login);
router.post("/menu",authenticate,upload.single('image'),menu.addMenu);
router.put('/approval/:id',authenticate,order.approvalOrder);
router.put('/updateMenu/:id',authenticate,upload.single('image'),menu.updateMenu);
router.put("/updateChef",authenticate,upload.single('image'),Chef.updateChef);
router.get("/getApprovalChef/",Chef.getApprovalChef);
router.get('/getById',authenticate,Chef.getChefById);
router.get("/",Chef.getAllChef);
router.get('/getMenu/:id',Chef.getAllMyMenu);
router.get('/getMenu/',authenticate,Chef.getAllMyMenu);
router.get('/myOrder',authenticate,order.getAllOrdersByChef);
router.delete('/delete',authenticate,Chef.deleteChef);
router.delete('/deleteMenu/:id',authenticate,menu.deleteMenu);

export default router;