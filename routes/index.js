var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

const userRouter = require('./user/userRoute');
const collectionRouter = require("./collection/collectionRoute");
const authRouter = require("./auth");

//other routes
router.use("/user", userRouter);
router.use("/collection", passport.authenticate('jwt', { session: false }), collectionRouter);
router.use("/", authRouter);

router.use(function(req,res,next){
  res.json({
    error: "API path not supported",
  });
});

module.exports = router;
