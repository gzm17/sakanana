var mongoose = require("mongoose");
var User = require("./user");
var FishStat = require("./fishstat");

//This doc captures all uploaded data for each user-session (at termination)
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
