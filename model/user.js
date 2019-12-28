var mongoose = require("mongoose");

//This defines a single session from one user schema for mongoose
var userSchema = new mongoose.Schema({
    uuid: {type: String, required: true},
    lastLogin: {type: Date, required: true},
    lastLogout: {type: Date, required: true},
    signupDate: {type: Date, required: true},
    numberOfLogins: {type: Number, required: true},
    isActive: {type: Boolean, required: true} // active (used the app in one month or not
});

var User = mongoose.model("User", userSchema);

module.exports = User;
