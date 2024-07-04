const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InvalidToken = require('../models/InvalidToken');

async function verifyChangePassword(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);

        if (decoded.loginType !== 'CHANGE' && decoded.loginType !== 'CREATE') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findOne({ email: decoded.email, id: decoded.userId });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (req.body.email !== decoded.email) {
            return res.status(401).json({ error: 'Email does not match' });
        }

        if (req.body.newpassword.length < 8) {
            return res.status(400).json({ error: 'New password must have 8 characters or more.' });
        }

        const tokenInDatabase = await InvalidToken.findOne({ where: { token: token } });

        if (tokenInDatabase) {
            return res.status(401).json({ error: 'Expired link' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = verifyChangePassword;
