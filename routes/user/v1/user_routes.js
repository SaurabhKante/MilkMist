const { getUsers, loginUser, addUser, changeRole } = require('../../../controllers/v1/user_controllers');

const router = require('express').Router();


router.get('/get-users', getUsers);
router.post('/login-user', loginUser);
router.post('/add-user', addUser);
router.post('/update-role', changeRole);

module.exports=router;