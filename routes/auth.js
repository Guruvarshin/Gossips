import express from 'express';
import passport from 'passport';

const router = express.Router();

//Auth with Google
//@route GET /auth/google

router.get('/google', passport.authenticate('google', {scope: ['profile']}));

//callback
//@route GET /auth/google/callback
router.get('/google/callback', 
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

//Logout user
//@route /auth/logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

export default router;