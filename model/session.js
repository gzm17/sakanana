var mongoose = require("mongoose");
var User = require("./user");
var FishStat = require("./fishstat");

//This defines myBorrowedBooks schema for mongoose: duration (length of time) is in weeks
var sessionSchema = new mongoose.Schema({
    uuid: {type: mongoose.Schema.Types.String, ref: 'User'},
    lastLogin: {type: Date, required: true},
    lastLogout: {type: Date, required: true},
    signupDate: {type: Date, required: true},
    numberOfLogins: {type: Number, required: true},
    fishes: [
        {
            id: {type: Number, required: true},
            kanji: {type: String, required: true},
            numberOfViews: {type: Number, required: true},
            numberOfQuizs: {type: Number, required: true},
            numberOfWins: {type: Number, required: true}
        }
    ]
});

var Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
