var mongoose = require("mongoose");

//This defines a single session from one user schema for mongoose
var userStatSchema = new mongoose.Schema({
    numberOfUsers: {type: Number, required: true},
    numberOfActives: {type: Number, required: true},
});

var UserStat = mongoose.model("UserStat", userStatSchema);

module.exports = UserStat;