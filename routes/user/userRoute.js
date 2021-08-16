var express = require('express');
var router = express.Router({mergeParams: true});
const passport = require('passport');

const userController = require("./userController");

//path: /user

//tested
//unauthenticated
//get 1 user by id
router.get('/:userid', userController.user_get_id);

//tested
//authenticated
//get current user
router.get('/', passport.authenticate('jwt', {session: false}), userController.user_get);

//tested
//authenticated
//delete current user
router.delete('/', passport.authenticate('jwt', {session: false}), userController.user_delete);

//tested - not fully
//authenticated
//update current user
router.put('/', passport.authenticate('jwt', {session: false}), userController.user_update);

module.exports = router;
