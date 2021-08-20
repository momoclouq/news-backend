const Collection = require("../../../model/collection");

let {body, validationResult} = require("express-validator");

//params: collectionid, newsid
exports.news_delete_id = function(req, res, next){
    Collection.findById(req.params.collectionid)
    .exec(async function(err, collection){
        if(err) return next(err);
        if(collection == null) return res.json({
            errors: "collection does not exist"
        });

        collection.item_ids.pull(req.params.newsid);
        await collection.save();

        return res.json({
            success: "News deleted"
        })
    })
}

//params: collectionid
exports.news_post_id = [
    body("newsid")
    .exists()
    .withMessage("news id must exist")
    .isInt()
    .custom((value) => value >= 1)
    .withMessage("news id must be an integer larger than 1"),
    (req, res, next) => {
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.json({
                errors: errors.array()
            });
        }else{
            //add news reference to the array
            Collection.findById(req.params.collectionid)
            .exec(async function(err, collection){
                if(err) return next(err);
                if(collection == null){
                    return res.json({
                        errors: "collection does not exist"
                    })
                }

                collection.item_ids.push(req.body.newsid);
                await collection.save();
                return res.json({
                    success: "news is added to collection " + req.params.collectionid
                });
            });
        }
    }
]