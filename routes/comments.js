const express=require('express');
const router=express.Router();
const commentsController=require('../controller/comments_controller');
const passport=require('passport');

router.post('/create',commentsController.create);
router.get('/destroy/:id',passport.checkAuthentication,commentsController.destroy);

module.exports=router;