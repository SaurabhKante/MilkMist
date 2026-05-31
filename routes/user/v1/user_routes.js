const { getUsers, loginUser } = require('../../../controllers/v1/user_controllers');

const router = require('express').Router();


router.get('/get-users', getUsers);
router.post('/login-user', loginUser);

module.exports=router;