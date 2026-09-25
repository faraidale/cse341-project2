const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');

router.use('/candidates', require('./candidates'));
router.use('/questions', require('./questions'));
router.use('/auth', authRoutes);

router.get('/login', authRoutes.login);
router.get('/github/callback', ...authRoutes.callback);
router.get('/logout', authRoutes.logout);

router.get('/', (req, res) => {
    res.status(200).json({
        authenticated: Boolean(req.isAuthenticated && req.isAuthenticated()),
        user: req.user || null
    });
});

module.exports = router;