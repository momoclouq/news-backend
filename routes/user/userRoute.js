var express = require('express');
var router = express.Router({mergeParams: true});
const passport = require('passport');

const userController = require("./userController");

//path: /user

//unauthenticated
//get 1 user by id
router.get('/:userid', userController.user_get_id);

//authenticated
//get current user
router.get('/', passport.authenticate('jwt', {session: false}), userController.user_get);

//authenticated
//delete current user
router.delete('/', passport.authenticate('jwt', {session: false}), userController.user_delete);

//authenticated
//update current user
router.post('/', passport.authenticate('jwt', {session: false}), userController.user_update);

module.exports = router;
