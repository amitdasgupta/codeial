const express=require('express');
const router=express.Router();
const friendController=require('../controller/friends_controller');

router.get('/add',friendController.add);
router.get('/delete',friendController.delete);

module.exports=router;