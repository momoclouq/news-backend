const User = require('../../model/user');
const passport = require('passport');

let { body, validationResult } = require("express-validator");

//unauthenticated
//params: userid
exports.user_get_id = (req, res, next) => {
    User.findById(req.params.userid)
    .select('username fullname city country created_date')
    .exec((err, user) => {
        if(err) return next(err);
        if(user == null) return res.status(406).json({
            errors: "user not found"
        });

        return res.json({
            foundUser: user
        });
    });
}

//authenticated
//params:
exports.user_get = (req, res, next) => {
    User.findById(req.user._id)
    .select('username fullname city country created_date email word_collection news_collection')
    .exec((err, userFound) => {
        if(err) return next(err);
        if(userFound == null) return res.status(406).json({
            errors: "user not found"
        });

        return res.json({
            userFound: userFound
        });
    });
}

//authenticated
//params: 
exports.user_update = [
    body('fullname').optional().isLength({max: 100}).withMessage("fullname must be less than 100 character-long"),
    body('city').optional().isString().withMessage("City must be a string"),
    body('country').optional().isString().withMessage("country must be a string"),
    (req, res, next) => {
        let errors = validationResult(req);

        let update = {};
        if(req.body.fullname) update.fullname = req.body.fullname;
        if(req.body.city) update.city = req.body.city;
        if(req.body.country) update.country = req.body.country;

        if(!errors.isEmpty()) return res.json({ errors: errors.array()});
        else {
            User.findByIdAndUpdate(req.user._id, update, (err, foundUser) => {
                if(err) return next(err);
                if(foundUser == null) return res.status(406).json({errors: "user not found"});

                return res.json({success: "user updated"});
            })
        }
    }
]

//authenticated
//params: userid
exports.user_delete = (req, res, next) => {
    User.findByIdAndDelete(req.user._id, (err, foundUser) => {
        if(err) return next(err);
        if(foundUser == null) return res.status(406).json({errors: "user not found"});

        return res.json({message: "user deleted"});
    });
}

