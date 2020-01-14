var mongoose = require("mongoose");

//This defines a single fish stat schema for all users. Note the difference between iOS and here
var fishStatSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    kanji: {type: String, required: true},
    numberOfViews: {type: Number, required: true},
    numberOfQuizs: {type: Number, required: true},
    numberOfWins: {type: Number, required: true}
});

var FishStat = mongoose.model("FishStat", fishStatSchema);

module.exports = FishStat;
