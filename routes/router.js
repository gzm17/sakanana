const router = require('express').Router()
let session = require('../model/session')
let userStat = require('../model/userstat')
let users = require('../model/user')
let fishes = require('../model/fishstat')
let dataProc = require('../processing/consolidateRecord.js')

router.route('/summary').get((req, res) => {
    console.log('GET triggered /summary')
    userStat.find()
        .then(stat => {
            // add code here
            res.json(stat)
        })
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/userdetails').get((req, res) => {
    console.log('GET triggered /userdetails')
    users.find()
        .then(users => {
            // add code here
            res.json(users)
        })
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/fishdetails').get((req, res) => {
    console.log('GET triggered /fishdetails')
    fishes.find()
        .then(fishes => {
            // add code here
            res.json(fishes)
        })
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/upload').post((req, res) => {
    console.log('POST triggered /upload')
    // console.log(req.body)
    const sessionData = req.body;

    const uuid = sessionData.uuid;
    const lastLogin = sessionData.lastLogin;
    const lastLogout = sessionData.lastLogout;
    const signupDate = sessionData.signupDate;
    const numberOfLogins = sessionData.numberOfLogins;
    const fishes = sessionData.fishes;

    console.log(sessionData.uuid)

    const newSession = new session({
        uuid,
        lastLogin,
        lastLogout,
        signupDate,
        numberOfLogins,
        fishes,
    });

    newSession.save()
        .then(() => {
            dataProc.updateUserInfo(newSession);
            dataProc.consolidateRecord(newSession);
            res.json('iOS data added to record');
        })
        .catch(err => res.status(400).json('Error: ' + err))
    });
    
    module.exports = router