const express = require("express");
const { response } = require("../../../app");
let Collection = require("../../../model/collection");
let router = express.Router({mergeParams: true});

const newsController = require("./newsController");

//path: /collection/:collectionid/news

//get news by id (check other api)

//check if collection is a news collection
router.use("/*", function(req, res, next){
    Collection.findById(req.params.collectionid)
    .exec(function(err, collection){
        if(err) return next(err);
        if(collection == null) return response.status(406).json({
            errors: "collection does not exist"
        });

        if(collection.type != "news") return res.status(406).json({
            errors: "wrong collection type"
        });
        else next();
    });
})

//delete word by id
router.delete('/:newsid', newsController.news_delete_id);

//post word
router.post('/', newsController.news_post_id);

module.exports = router;