var express = require('express');
var router = express.Router({mergeParams: true});

const collectionRouter = require('./collection/collectionRoute')

//next path
router.use('/:userid/collection', collectionRouter);

//path: /user
//get 1 user by id
router.get('/:userid', function(req, res, next) {
  res.send('get request on user ' + req.params.userid);
});

//update 1 user by id
router.put('/:userid', function(req, res, next){
  res.send('update request on user ' + req.params.userid);
});

//delete 1 user by id
router.delete('/:userid', (req, res, next) => {
  res.send('delete request on user ' + req.params.userid);
});

//create a user
router.post('/', (req,res,next) => {
  res.send('post request on user');
});

module.exports = router;
