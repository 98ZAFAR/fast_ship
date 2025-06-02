const jwt = require('jsonwebtoken');

const createToken = (user)=>{
    const payload = {
        id:user.id,
        name:user.name,
        email:user.email,
        profileURL:user.profileURL,
        role:user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'1d'});

    return token;
};

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
};

const generateVerificationToken = (userId) => {
    const payload = { userId };
    const verificationToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return verificationToken;
}

module.exports = {createToken, verifyToken, generateVerificationToken};