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

router.route('/uploadSessionEnd').post((req, res) => {
    console.log('POST triggered /upload')
    // console.log(req.body)
    const sessionData = req.body;

    const uuid = sessionData.uuid;
    const lastLogin = sessionData.lastLogin;
    const lastLogout = sessionData.lastLogout;
    const signupDate = sessionData.signupDate;
    const numberOfLogins = sessionData.numberOfLogins;
    const fishes = sessionData.fishes;

    console.log("POST DATA SessionEnd uuid = " + uuid)

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
            //dataProc.updateUserInfo(newSession); // This is done via /uploadSessionStart
            dataProc.consolidateRecord(newSession);
            res.json('New session data added to record at the end of session');
        })
        .catch(err => res.status(400).json('Error: ' + err))
    });

    // Process upload of user info at the start of a session
    router.route('/uploadSessionStart').post((req, res) => {
        console.log('POST received /uploadSessionStart')
        const userData = req.body;
    
        const uuid = userData.uuid;
        const lastLogin = userData.lastLogin;
        const lastLogout = userData.lastLogout;
        const signupDate = userData.signupDate;
        const numberOfLogins = userData.numberOfLogins;
    
        console.log("POST DATA SessionStart uuid = " + uuid)

        const newUser = new users({
            uuid,
            lastLogin,
            lastLogout,
            signupDate,
            numberOfLogins,
        });
        dataProc.updateUserInfo(newUser);
        });
    
    module.exports = router