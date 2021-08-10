var express = require('express');
var router = express.Router();

const userRouter = require('./user/userRoute');
const wordRouter = require('./word/wordRoute');

//other routes
router.use("/user", userRouter);
router.use("/word", wordRouter);

module.exports = router;
