var express = require('express');
const User = require('../../../model/user');
var router = express.Router({mergeParams: true});

const wordController = require('./wordController');

//path: collection/:collectionid/word

//check if collection is a word collection
router.use("/*", function(req, res, next){
    Collection.findById(req.params.collectionid)
    .exec(function(err, collection){
        if(err) return next(err);
        if(collection == null) return res.json({
            errors: "collection does not exist"
        });

        if(collection.type != "word") return res.json({
            errors: "wrong collection type"
        });
        else next();
    });
})

//get word by id
router.get('/:wordid', wordController.word_get_id);

//put word by id
router.put('/:wordid', wordController.word_put_id);

//delete word by id
router.delete('/:wordid', wordController.word_delete_id);

//post word
router.post('/', wordController.word_post);

//get all word in the collection
router.get("/", wordController.word_get_all);

module.exports = router;
