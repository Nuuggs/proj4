import express from 'express';
import UserCtrl from '../controllers/userCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const userCtrl = new UserCtrl('main', db.User, db);

// router.post('/logout', userCtrl.getMain.bind(userCtrl));
router.post('/register', userCtrl.postRegister.bind(userCtrl));
router.post('/login', userCtrl.postLogin.bind(userCtrl));
router.post('/email', userCtrl.postEmail.bind(userCtrl));
router.post('/friends', userCtrl.getUsers.bind(userCtrl));

export default router;
