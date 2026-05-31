const router = require('express').Router();

router.use('/v1',require("./v1/user_routes"))

module.exports=router;