var express = require('express');
var router = express.Router({mergeParams: true});

//path: /user/:userid/collection
//get 1 collection by id
router.get('/:collectionid', function(req, res, next) {
  res.send('get request on collection ' + req.params.collectionid + " of user " + req.params.userid);
});

//update 1 collection by id
router.put('/:collectionid', function(req, res, next){
    res.send('put request on collection ' + req.params.collectionid + " of user " + req.params.userid);
});

//delete 1 collection by id
router.delete('/:collectionid', (req, res, next) => {
    res.send('delete request on collection ' + req.params.collectionid + " of user " + req.params.userid);
});

//create a collection
router.post('/', (req,res,next) => {
    res.send("post request on collection " + req.params.userid);
});

//get all collection
router.get('/', (req, res, next) => {
    res.send('get request on all collection of user ' + req.params.userid);
});

module.exports = router;
