const mongoose = require('mongoose');
const Collection = require("../../model/collection");
const Word = require("../../model/word");

let { body, validationResult } = require('express-validator');
const User = require("../../model/user");

//all routes authenticated

//tested
//params: userid, collectionid
exports.collection_get_id = (req, res, next) => {
    Collection.findById(req.params.collectionid, (err, collection) => {
        if(err) return next(err);
        if(collection == null) return res.status(406).json({
            errors: "collection not found"
        });

        return res.json({
            collection: collection
        });
    });
};

//tested
//params: collectionid
exports.collection_put_id = [
    body('name').exists().isLength({max: 100, min: 1}).withMessage("name must be less than 100 character-long and exist"),
    body('created_date').optional().isDate(),
    (req, res, next) => {
        let errors = validationResult(req);

        let update = {
            name: req.body.name,
        };
        if(req.body.created_date != null) update.created_date = req.body.created_date;

        if(!errors.isEmpty()){
            return res.status(406).json({
                errors: errors.array(),
            });
        }
        else {
            Collection.findByIdAndUpdate(new mongoose.Types.ObjectId(req.params.collectionid), update, (err, oldCollection) => {
                if(err) return next(err);
                if(oldCollection == null) return res.status(406).json({
                    errors: "collection cannot be found",
                })

                return res.json({
                    success: "collection is updated"
                })
            })
        }
    }
];

//params: collectionid
//needs checking the words id and news id
exports.collection_delete_id = (req, res, next) => {
    Collection.findByIdAndDelete(req.params.collectionid, async (err, oldCollection) => {
        if(err) return next(err);
        if(oldCollection == null) return res.status(406).json({
            errors: "collection cannot be found",
        });

        //remove old reference from the user collection list
        User.findById(req.user._id).exec(async (err, user) => {
            if(err) return next(err);
            if(user == null) return res.status(406).json({
                errors: "user does not exist"
            })

            try{
                if(oldCollection.type == 'word') {
                    user.word_collection.pull(req.params.collectionid);
                }
                else user.news_collection.pull(req.params.collectionid);
                await user.save();

                return res.json({
                    success: "collection deleted"
                });
            }catch(error){
                return next(error);
            }
        });
    });
};

//tested
//params: 
exports.collection_post = [
    body('name').exists().isLength({max: 100, min: 1}).withMessage("name must be less than 100 character-long and exist"),
    body('type').isIn(["news", 'word']).withMessage("type must be either: word or news"),
    async (req, res, next) => {
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(406).json({
                errors: errors.array(),
            });
        }
        else{
            try{
                let newCollection = await Collection.create({
                    name: req.body.name,
                    item_ids: [],
                    type: req.body.type,
                });

                let user = await User.findById(req.user._id);
                
                if(newCollection.type == 'news') await user.update({ $push: { news_collection: newCollection._id}});
                if(newCollection.type == 'word') await user.update({ $push: { word_collection: newCollection._id}});

                return res.json({
                    success: "collection is created for user " + req.user._id,
                    collectionid: newCollection._id
                });
            }   
            catch(err){
                return next(err);
            }

        }
    }
];

//tested
//params:
exports.collection_get_all = (req, res, next) => {
    Collection.find({})
    .select('type name created_date')
    .sort({create_date: "desc"})
    .exec(function(err, collections){
        if(err) return next(err);
        res.json({
            collections: collections
        });
    })
}
