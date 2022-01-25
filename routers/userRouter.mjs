import express from 'express';
import UserCtrl from '../controllers/userCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const userCtrl = new UserCtrl('main', db.User, db);

// routes for user registration/login functionality

// router.post('/logout', userCtrl.getMain.bind(userCtrl));
router.post('/register', userCtrl.postRegister.bind(userCtrl));
router.post('/login', userCtrl.postLogin.bind(userCtrl));
router.post('/email', userCtrl.postEmail.bind(userCtrl));

// routes for friends page functionality
router.post('/friends', userCtrl.addFriends.bind(userCtrl));
router.get('/allFriends/:id', userCtrl.getFriends.bind(userCtrl));

// routes for session functionality
router.get('/session/:id', userCtrl.getSession.bind(userCtrl));
router.post('/session/new', userCtrl.postSession.bind(userCtrl));

export default router;
