const express=require('express');
const router=express.Router();
const postController=require('../controller/post_controller');

router.get('/',postController.posts);

router.get('/edit',postController.edit);

module.exports=router;