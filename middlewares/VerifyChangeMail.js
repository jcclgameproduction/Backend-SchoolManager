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

        if (decoded.loginType !== 'CHANGEMAIL') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findOne({ id: decoded.id });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (req.body.newemail !== decoded.email) {
            return res.status(401).json({ error: 'Email does not match' });
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
