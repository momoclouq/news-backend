const mongoose = require('mongoose');
const Collection = require("../../model/collection");

let { body, validationResult } = require('express-validator');
const User = require("../../model/user");

//all routes authenticated
//params: userid, collectionid
exports.collection_get_id = (req, res, next) => {
    Collection.findById(req.params.collectionid, (err, collection) => {
        if(err) return next(err);
        if(collection == null) return res.json({
            errors: "collection not found"
        });

        return res.json({
            collection: collection
        });
    });
};

//params: collectionid
exports.collection_put_id = [
    body('name').exists().isLength({max: 100, min: 1}).withMessage("name must be less than 100 character-long and exist"),
    body('created_date').isDate(),
    (req, res, next) => {
        let errors = validationResult(req);

        let update = {
            name: req.body.name,
        };
        if(req.body.created_date != null) update.created_date = req.body.created_date;

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array(),
            });
        }
        else {
            Collection.findByIdAndUpdate(new mongoose.Types.ObjectId(req.params.collectionid), update, (err, oldCollection) => {
                if(err) return next(err);
                if(oldCollection == null) return res.json({
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
    Collection.findByIdAndDelete(req.params.collectionid, (err, oldCollection) => {
        if(err) return next(err);
        if(oldCollection == null) return res.json({
            errors: "collection cannot be found",
        })

        return res.json({
            success: "collection is deleted"
        })
    })
};

//params: 
exports.collection_post = [
    body('name').exists().isLength({max: 100, min: 1}).withMessage("name must be less than 100 character-long and exist"),
    body('type').isIn(["news", 'word']),
    async (req, res, next) => {
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
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
                    success: "collection is created for user " + req.user._id
                });
            }   
            catch(err){
                return next(err);
            }

        }
    }
];

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
