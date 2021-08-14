var express = require('express');
const User = require('../../../model/user');
var router = express.Router({mergeParams: true});

const wordController = require('./wordController');

//path: collection/:collectionid/word

//check if word is in the collection
//problem: too long @@
// router.use("/:wordid", function(req, res, next){
//     User.findById(req.user._id)
//     .select("word_collection")
//     .exec(function(err, user){
//         if(err) return next(err);
//         if(!user) return res.json({
//             errors: "not found user"
//         });

//         user.word_collection.foreach(async (id) => {
            
//         })
//     })
// });

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
