import express from 'express';
import MatchCtrl from '../controllers/matchCtrl.mjs';
import db from '../models/index.mjs';

// Initialize express router
const router = express.Router();
// Initialize Controller
const matchCtrl = new MatchCtrl('main', db.Match, db);

router.post('/match', matchCtrl.createSession.bind(matchCtrl));
router.post('/swipe/ifCreate', matchCtrl.swipeUpdateCreate.bind(matchCtrl));
router.post('/swipe/ifJoin', matchCtrl.swipeUpdateJoin.bind(matchCtrl));
router.post('/join', matchCtrl.joinSession.bind(matchCtrl));

export default router;
