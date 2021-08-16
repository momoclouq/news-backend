const Word = require('../../../model/word');

const Collection = require('../../../model/collection');
const {body, validationResult} = require('express-validator');
const mongoose = require('mongoose');

//tested
//params: wordid
exports.word_get_id = (req, res, next) => {
    Word.findById(req.params.wordid).exec((err, word) => {
        if (err) return next(err);
        //check if word is found, return error otherwise
        if (word == null) res.json({
            errors: "word is not found"
        });

        //return word
        res.json({
            word: word
        });
    });
};

//tested
//params: collectionid
exports.word_post = [
    body('value').exists().isLength({min: 1}).withMessage("word must be not empty"),    
    body('note').optional().isLength({max: 200}).withMessage("Note must be less than 200 character-long"),
    async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.json({
                errors: errors.array(), 
            });
        } else {
            try{
                let newWord = await Word.create({
                    value: req.body.value,
                    note: req.body.note
                });

                let collection = await Collection.findById(req.params.collectionid);

                await collection.update({$push: {item_ids: newWord._id.toString()}});

                return res.json({
                    success: "word is created for collection " + collection._id
                });
            }   
            catch(err){
                return next(err);
            }
        }
    }
];

//tested
//params: wordid
exports.word_put_id = [
    body('note').isLength({max: 200}).withMessage("Note must be less than 200 character-long"),
    (req, res, next) => {
        const errors = validationResult(req);

        const update = {
            note: req.body.note
        }

        if(!errors.isEmpty()) return res.json({ errors: errors.array() });
        else {
            Word.findByIdAndUpdate(req.params.wordid, update, function(err, temp){
                if(err) return next(err);
                if (temp == null) res.json({ errors: "word is not found"});
                else res.json({ success: temp});
            });
        }
    }
];

//params: collectionid, wordid
exports.word_delete_id = async (req, res, next) => {
    await Collection.updateOne( {_id: req.params.collectionid}, { $pull: {item_ids: [req.params.wordid] } });
    Word.findByIdAndDelete(req.params.wordid).exec((err, temp) => {
        if(err) return next(err);
        if(temp == null) res.json({
            errors: "word is not found"
        });

        //return success message
        res.json({
            success: "word deleted"
        });
    });
}

//tested
//params: collectionid
exports.word_get_all = (req, res, next) => {
    Collection.findById(req.params.collectionid)
    .exec(async function(err, collection){
        if (err) return next(err);
        if(collection == null) return res.json({
            errors: "collection not found"
        });

        let allWords = await Promise.all(collection.item_ids.map(async (id) => {
            try{
                let foundWord = await Word.findById(id);
                return foundWord;
            }catch(err){
                return next(err);
            }
        }));

        return res.json({
            allWords: allWords
        });
    });
}