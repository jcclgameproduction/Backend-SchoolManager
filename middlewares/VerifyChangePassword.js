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
        console.log("\n\n")
        console.log(`${user}`)
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (req.body.email !== decoded.email) {
            return res.status(404).json({ error: 'Email does not match' });
        }

        if (req.body.newpassword.length < 8) {
            return res.status(400).json({ error: 'A senha dever 8 caracteres ou mais.' });
        }

        const tokenInDatabase = await InvalidToken.findOne({ where: { token: token } });

        if (tokenInDatabase) {
            return res.status(401).json({ error: 'Link expirado.' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token Inválido.' });
    }
}

module.exports = verifyChangePassword;
