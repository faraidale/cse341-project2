const express = require('express');
const passport = require('../auth');

const router = express.Router();

const login = (req, res, next) => {
    if (!passport.githubConfigured) {
        return res.status(503).json({ message: 'GitHub OAuth is not configured.' });
    }
    return passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
};

const callback = [
    (req, res, next) => {
        if (!passport.githubConfigured) {
            return res.status(503).json({ message: 'GitHub OAuth is not configured.' });
        }
        return passport.authenticate('github', { failureRedirect: '/auth/login-failed' })(req, res, next);
    },
    (req, res) => {
        res.redirect('/api-docs/');
    }
];

router.get('/login-failed', (req, res) => {
    res.status(401).json({ message: 'GitHub authentication failed.' });
});

router.get('/status', (req, res) => {
    res.status(200).json({
        authenticated: Boolean(req.isAuthenticated && req.isAuthenticated()),
        user: req.user || null
    });
});

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((sessionError) => {
            if (sessionError) {
                return next(sessionError);
            }
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: 'Logged out successfully.' });
        });
    });
};

router.get('/github', login);
router.get('/github/callback', ...callback);
router.get('/logout', logout);

module.exports = router;
module.exports.login = login;
module.exports.callback = callback;
module.exports.logout = logout;
