import express from 'express';
import UserCtrl from '../controllers/userCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const userCtrl = new UserCtrl('user', db.User, db);

router.get('/', userCtrl.getMain.bind(userCtrl));
// router.post('/register', mainCtrl.postRegister);
// router.post('/login', mainCtrl.postLogin);

export default router;