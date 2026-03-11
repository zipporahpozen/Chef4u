import express from 'express';
const router = express.Router();
import * as Menu from '../Controller/menu.js'

router.get("/",Menu.getAllMenu);
router.get('/creatorId/:id',Menu.getChefByCreatorID);
router.get('/getMenuById/:id',Menu.getMenuById)
export default router;
