var mongoose = require("mongoose");

//This defines summarises all users
var userStatSchema = new mongoose.Schema({
    numberOfUsers: {type: Number, required: true},
    numberOfActives: {type: Number, required: true},
});

var UserStat = mongoose.model("UserStat", userStatSchema);

module.exports = UserStat;