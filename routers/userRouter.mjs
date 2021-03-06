import express from 'express';
import UserCtrl from '../controllers/userCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const userCtrl = new UserCtrl('main', db.User, db);

// import middleware for routes
import tokenAuth from '../middlewares/auth.mjs';

// routes for user registration/login functionality

// router.post('/logout', userCtrl.getMain.bind(userCtrl));
router.post('/register', userCtrl.postRegister.bind(userCtrl));
router.post('/login', userCtrl.postLogin.bind(userCtrl));
router.post('/email', userCtrl.postEmail.bind(userCtrl));

// routes for friends page functionality
router.post('/friends', tokenAuth(), userCtrl.addFriends.bind(userCtrl));
router.get('/allFriends/:id', userCtrl.getFriends.bind(userCtrl));

// route for to find existing session
router.get('/session/:id', tokenAuth(), userCtrl.getSession.bind(userCtrl));

// route to delete existing session
router.delete('/delete/:sessionId', tokenAuth(), userCtrl.deleteSession.bind(userCtrl));

export default router;
