const jwt = require("jsonwebtoken");

const { secretkey } = require('./config/keys');

const GenerateJWT = (username) => {
    return jwt.sign(username, secretkey, { expiresIn: '1800s' });
};

const ValidateJWT = (token) => {
    try {
        var decoded = jwt.verify(token, secretkey);
        return decoded;
    } catch (err) {
        console.log("token not verified", err.name)
        console.log("error message", err.message)
        const Error = { name: err.name, msg: err.message }
        return Error;
    }
};

module.exports = {
    GenerateJWT,
    ValidateJWT
};