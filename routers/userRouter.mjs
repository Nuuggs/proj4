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
router.get('/session', userCtrl.getSession.bind(userCtrl));
router.post('/session/new', userCtrl.postSession.bind(userCtrl));

export default router;