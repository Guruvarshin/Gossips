import express from 'express';
import { ensureAuth } from '../middleware/auth.js';

import Gossip from '../models/Gossip.js';
const router = express.Router();


//Show add page
// get /gossips/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('gossips/add');
});

//Process add form
// post /gossips
router.post('/', ensureAuth, async(req, res) => {
    try{
        req.body.user=req.user.id;
        await Gossip.create(req.body);
        res.redirect('/dashboard');
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

//Show single gossip
// get /gossips/:id
router.get('/:id', ensureAuth, async(req, res) => {
    try{
        let gossip = await Gossip.findById(req.params.id).populate('user').lean();
        if(!gossip) {
            return res.render('error/404');
        }
        if(gossip.user._id != req.user.id && gossip.status == 'private') {
            res.render('error/404');
        } else {
            res.render('gossips/show', {gossip});
        }
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});


//Show all gossips
// get /gossips
router.get('/', ensureAuth, async(req, res) => {
    try{
        console.log('Fetching public gossips');
        const gossips = await Gossip.find({status: 'public'}).populate('user').sort({createdAt: 'desc'}).lean();

        res.render('gossips/index', {gossips});
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

//Show edit page
// get /gossips/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try{
        const gossip = await Gossip.findOne({_id: req.params.id}).lean();
        if(!gossip) {
            return res.render('error/404');
        }
        if(gossip.user != req.user.id) {
            res.redirect('/gossips');
        } else {
            res.render('gossips/edit', {gossip});
        }
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

//Update gossip
// put /gossips/:id
router.put('/:id', ensureAuth, async(req, res) => {
    try{
        let gossip = await Gossip.findById(req.params.id).lean();
        if(!gossip) {
            return res.render('error/404');
        }
        if(gossip.user != req.user.id) {
            res.redirect('/gossips');
        } else {
            gossip = await Gossip.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true});
            res.redirect('/dashboard');
        }
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

//Delete gossip
// delete /gossips/:id
router.delete('/:id', ensureAuth, async(req, res) => {  
    try{
        let gossip = await Gossip.findById(req.params.id).lean();
        if(!gossip) {
            return res.render('error/404');
        }
        if(gossip.user != req.user.id) {
            res.redirect('/gossips');
        } else {
            await Gossip.findByIdAndDelete(req.params.id);
            res.redirect('/dashboard');
        }
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

//User gossips
// get /gossips/user/:userId
router.get('/user/:userId', ensureAuth, async(req, res) => {
    try{
        const gossips = await Gossip.find({user: req.params.userId, status: 'public'}).populate('user').lean();
        res.render('gossips/index', {gossips});
    }
    catch(err) {
        console.error(err);
        res.render('error/500');
    }
});
export default router;