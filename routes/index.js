import express from 'express';
import { ensureAuth, ensureGuest } from '../middleware/auth.js';

import Gossip from '../models/Gossip.js';
const router = express.Router();


//Login/Landing page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {layout: 'login'});
});

//dashboard
router.get('/dashboard', ensureAuth, async(req, res) => {
    try{
        const gossips = await Gossip.find({user: req.user.id}).lean();
        res.render('dashboard', {name: req.user.firstName, gossips});
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

export default router;