const express=require('express');

const router=express.Router();
const postApi=require('../../../controller/api/v2/posts_api');

router.get('/',postApi.index);

module.exports=router;