import express from 'express';
import MainCtrl from '../controllers/mainCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const mainCtrl = new MainCtrl('main', db.User, db);

router.get('/', mainCtrl.getMain.bind(mainCtrl));
// router.post('/register', mainCtrl.postRegister);
// router.post('/login', mainCtrl.postLogin);

export default router;