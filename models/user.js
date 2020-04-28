const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    status: Boolean,
    loggedInFlag: Boolean,
    createdDate: Date
});
module.exports = mongoose.model("users", userSchema)
