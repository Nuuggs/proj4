import express from 'express';
import MatchCtrl from '../controllers/matchCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const matchCtrl = new MatchCtrl('main', db.Match, db);

// Creates new session
router.post('/create', matchCtrl.createSession.bind(matchCtrl));

router.post('/swipe', matchCtrl.swipeUpdate.bind(matchCtrl));

// Finds existing session
router.get('/session/:sessionId', matchCtrl.findSession.bind(matchCtrl));

export default router;
