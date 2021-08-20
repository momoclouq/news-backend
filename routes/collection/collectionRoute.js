var express = require('express');
var router = express.Router({mergeParams: true});

const User = require('../../model/user');

const collectionController = require('./collectionController');

const wordRouter = require("./word/wordRoute");
const newsRouter = require("./news/newsRoute");
//path: /collection

//create a collection
router.post('/', collectionController.collection_post);

//get all collection
router.get('/', collectionController.collection_get_all);

//error in handling sub route
//check if collectionid belongs to the user
router.use("/:collectionid/*", async function(req, res, next){
    try{
        let user = await User.findById(req.user._id);
        let found = false;

        user.news_collection.forEach((id) => {
            if(id.toString() == req.params.collectionid) found = true;
        });

        user.word_collection.forEach((id) => {
            if(id.toString() == req.params.collectionid) found = true;
        });
        
        //for some reasons, return next() does not ensure actual next()?
        if(found){
            return next();
        }else{
            return res.status(406).json({
                errors: "wrong collection id"
            });
        }
        
    }
    catch(err){
        return next(err);
    }
});

//word route
router.use("/:collectionid/word", wordRouter);

//news route
router.use("/:collectionid/news", newsRouter);

//get 1 collection by id
router.get('/:collectionid', collectionController.collection_get_id);

//update 1 collection by id
router.put('/:collectionid', collectionController.collection_put_id);

//delete 1 collection by id
router.delete('/:collectionid', collectionController.collection_delete_id);

module.exports = router;
