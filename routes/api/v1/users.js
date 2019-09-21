const express=require('express');
const bodyParser = require('body-parser').json();
const router=express.Router();
const usersApi=require('../../../controller/api/v1/users_api');

router.post('/create-session',bodyParser,usersApi.createSession);  

module.exports=router;