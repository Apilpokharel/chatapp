

'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../controller/AuthController');
const handler = require('../handlers/FileUpload');
const AWShandler = require('../handlers/AWSFileUpload');
const home = require('../controller/HomeController');

    router.get('/', auth.Authenticate, home.suggestion, home.friends, home.messages, home.homePage);
    router.get('/json', auth.Authenticate, home.suggestion, home.friends, home.messages, home.homeJson);

    router.get('/signup', auth.signupPage);
    router.post('/signup', auth.validateSignup ,auth.signupPost);

    router.get('/login', auth.loginPage);
    router.post('/login', auth.loginPost);

    router.get('/logout',auth.Authenticate, auth.logout);
    
    router.post('/user/:id', auth.Authenticate, AWShandler.upload, home.userPost);
    
    router.get('/summ_add/:sum', auth.Authenticate, home.addUser);
    router.get('/summ_remove/:sum', auth.Authenticate, home.removeUser);


    router.get('/private_chat/:chatname', auth.Authenticate, home.privateChat);

    router.get('/peer', auth.Authenticate, home.peer_client);

   router.post('/chatpost', auth.Authenticate, home.messagePost);
   
   router.post('/delete/:id', auth.Authenticate, home.deleteChat);

   router.post('/chatpost/file', auth.Authenticate, AWShandler.manyUpload, home.messageFileUpload);
module.exports = router;