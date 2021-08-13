var express = require('express');
var router = express.Router({mergeParams: true});

const wordRouter = require("./word/wordRoute");
const collectionController = require('./collectionController');
//path: /collection

//word route
router.use("/:collectionid/word", wordRouter);

//check if collectionid belongs to the user
router.use("/:collectionid", async function(req, res, next){
    try{
        let user = await User.findById(req.user._id);
        user.news_collection.foreach((id) => {
            if(id.toString() == req.body.collectionid) return next();
        });

        user.word_collection.foreach((id) => {
            if(id.toString() == req.body.collectionid) return next();
        });

        return res.json({
            errors: "wrong collection id search"
        });
    }
    catch(err){
        return next(err);
    }
});

//get 1 collection by id
router.get('/:collectionid', collectionController.collection_get_id);

//update 1 collection by id
router.put('/:collectionid', collectionController.collection_put_id);

//delete 1 collection by id
router.delete('/:collectionid', collectionController.collection_delete_id);

//create a collection
router.post('/', collectionController.collection_post);

//get all collection
router.get('/', collectionController.collection_get_all);

module.exports = router;
