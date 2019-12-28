var mongoose = require("mongoose");
const router = require('express').Router()
let fishStat = require('../model/fishstat')
let userStat = require('../model/userstat')
let user = require('../model/user')
const activeThreshold = 30 // number of days within which user has logged in

module.exports.consolidateRecord = function(sessionData) { // Update fishStat doc using the current post data (from one user)
    var foundFish = false
    //console.log("IN consolidateRecord() sessionData = " + sessionData);
    fishStat.find()
        .then(fishes => {
            //console.log("fishStat = " + fishes, Boolean(fishes));
            if (Object.keys(fishes).length > 0) {
                //console.log("ENter fishes interation loop");
                sessionData.fishes.forEach(function(fish1, index){
                    foundFish = false
                    fishes.forEach(function(fish2){
                        if (fish1.id === fish2.id && fish1.kanji === fish2.kanji) {
                            //console.log("Match found: fish = " + fish1 + " fishFromSession = " + fish2);
                            foundFish = true
                            fish2.numberOfViews += fish1.numberOfViews;
                            fish2.numberOfQuizs += fish1.numberOfQuizs;
                            fish2.numberOfWins += fish1.numberOfWins;
                            fish2.save()
                                .then(() => console.log("fishStat updated"))
                                .catch(err => console.log("FishStat update error: " + err))
                        }
                    })

                    // if fish1 (from session) is not found in fishStat DB (fish2)
                    if (!foundFish) {
                        const newFish = new fishStat({
                            id: fish1.id,
                            kanji: fish1.kanji,
                            numberOfViews: fish1.numberOfViews,
                            numberOfQuizs: fish1.numberOfQuizs,
                            numberOfWins: fish1.numberOfWins
                        });
                        //console.log("newFish to be saved: " + newFish);
            
                        newFish.save()
                            .then(() => console.log("Matching: New fish saved"))
                            .catch(err => console.log("Matching: new Fish Save ERROR: " + err));
                    }   
                })
            } else {
               // console.log("fishes db not found");
                sessionData.fishes.forEach(function(fish){
                    const newFish = new fishStat({
                        id: fish.id,
                        kanji: fish.kanji,
                        numberOfViews: fish.numberOfViews,
                        numberOfQuizs: fish.numberOfQuizs,
                        numberOfWins: fish.numberOfWins
                    });
                    // console.log("newFish: " + newFish);

                    newFish.save()
                        .then(() => console.log("New Record: New fish saved"))
                        .catch(err => console.log("New record: Fish Save ERROR: " + err));
                })
            }
        })
        .catch(err => console.log("Err: " + err));
}

module.exports.updateUserInfo = function(sessionData) { // Update userstat doc using the current post data (from one user)
    const thisUuid = sessionData.uuid
    var numberOfUsers = 0
    var numberOfActives = 0
    var foundSessionUser = false
    console.log("Enter updateUserInfo user = " + thisUuid);

    // user.findOne({'uuid': thisUuid}, (err, u) => { // update user status
    //     console.log("usr = " + u);
    //     if (u) {
    //         u.uuid = sessionData.uuid;
    //         u.numberOfLogins += 1;
    //         u.lastLogin = sessionData.login;
    //         u.lastLogout = sessionData.logout;
    //         u.signupDate = sessionData.signupDate;
    //         u.isActive = true;
    //         console.log("user update before save: "+ u);
    //         u.save().then(() => console.log("User Info updated: "+u)).catch(err => console.log("UserInfo update Error: " + err));
    //     } else {
    //         const newUser = new user({
    //             uuid: sessionData.uuid,
    //             lastLogin: sessionData.login,
    //             lastLogout: sessionData.logout,
    //             signupDate: sessionData.signupDate,
    //             numberOfLogins: 1,
    //             isActive: true
    //         })
    //         newUser.save()
    //             .then(() => console.log("newUser added: " + newUser))
    //             .catch(err => console.log("newUser saving err: " + err))
    //     }

    //     if (err) {
    //         console.log("user.findOne err: " + err)
    //     }
    // })

    // update all user stats
    user.find()
        .then(users => {
            numberOfUsers = Object.keys(users).length;
            numberOfActives = numberOfUsers
            console.log("user.find() users= " + users)
            users.forEach(function(thisUser) {
                const now = Date.parse(Date())
                const oneDay = 24*60*60*1000;
                const diffInDays = Math.round(Math.abs(now - Date.parse(Date(thisUser.lastLogin)))/oneDay);
                console.log("user.find() diffDays = " + diffInDays + " threshold = " + activeThreshold + " #users = "+ numberOfUsers);
                if ( diffInDays > activeThreshold ) {
                    thisUser.isActive = false 
                    numberOfActives = numberOfUsers - 1
                    thisUser.save().then(() => {console.log("user.find() u = " + thisUser)}).catch(err => console.log("userstat update err " + err))
                }
                if (thisUser.uuid === thisUuid ) { // update sessionUserStatus
                    foundSessionUser = true;
                    thisUser.numberOfLogins += 1;
                    thisUser.lastLogin = sessionData.lastLogin;
                    thisUser.lastLogout = sessionData.lastLogout;
                    thisUser.signupDate = sessionData.signupDate;
                    thisUser.isActive = true;
                    console.log("user update before save: "+ thisUser);
                    thisUser.save().then(() => console.log("User Info updated: "+thisUser)).catch(err => console.log("UserInfo update Error: " + err));
                }
            })
        })
        .then(() => {
            if (foundSessionUser === false) {
                const newUser = new user({
                    uuid: sessionData.uuid,
                    lastLogin: sessionData.lastLogin,
                    lastLogout: sessionData.lastLogout,
                    signupDate: sessionData.signupDate,
                    numberOfLogins: sessionData.numberOfLogins,
                    isActive: true
                })
                console.log("newUser: numberOfLogins = " + sessionData.numberOfLogins)
                newUser.save()
                    .then(() => console.log("newUser added: " + newUser))
                    .catch(err => console.log("newUser saving err: " + err))
            }
        })
        .then(() => {
        // update userStat: ZG still issue - userStat is done before new user add is executed
        userStat.find()
            .then(record => {
                if(Object.keys(record).length > 0) { // if userstat db is not empty}
                console.log("record = " + record);
                    record.forEach(function(r){
                        r.numberOfActives = numberOfActives;
                        r.numberOfUsers = numberOfUsers;
                        console.log("before record.save: " + r)
                        r.save().then(() => console.log("userStat updated: " + r)).catch(err => console.log("userStat update err " + err))
                    })
                } else {
                    const newRecord = new userStat({
                        numberOfUsers: 1,
                        numberOfActives: 1
                    })
                    newRecord.save().then(() => console.log("userStat db created")).catch(err => console.log("userStat DB creation err "+ err))
                }
            })
            .catch(err => console.log("userStatFind err " + err))
        })
        .catch(err => console.log("user.find err " + err))

    }
