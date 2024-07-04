const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const InvalidToken = require('../models/InvalidToken');

async function verifyAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET.toString());

        if (decoded.loginType !== 'NORMAL') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Search for the user in the database using the email from the JWT payload
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const tokenInDatabase = await InvalidToken.findOne({ where: { token: token } });
        if (tokenInDatabase) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Save the user in a variable for later use in the route
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = verifyAuth;
