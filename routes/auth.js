const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');

//tested
//authentication
router.post(
    '/login',
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if(err) {
              const error = new Error('An error occurred.');
  
              return next(error);
            }

            //wrong email or password
            if(!user){
                return res.status(401).json({
                    errors: info.message
                });
            }

            //function to establish a login session
            //we do not use session so session: false, function is just for fun
            req.login(
                user,
                { session: false },
                async (error) => {
                    if (error) return next(error);
    
                    const body = { _id: user._id, email: user.email };
                    const token = jwt.sign({ user: body }, 'cutecat');
    
                    return res.json({ token });
                }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
);

//tested
router.post('/signup', [
    body('username').exists().isLength({max: 50}).withMessage("username must be less than 50 character-long"),
    body('fullname').exists().isLength({max: 100}).withMessage("fullname must be less than 100 character-long"),
    body('email').exists().isEmail().withMessage("email must be in correct format"),
    body('password').exists().withMessage("password must be filled"),
    (req, res, next) => {
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }
        else next();
    },
    function(req, res, next){
      passport.authenticate("signup", {session: false}, function(err, user, info){
        if (err) return next(err);
        if(user) return res.json({
          message: "sign up successful",
          user: user
      })
        else res.status(422).json({
          errors: info.message
        })
      })(req, res, next);
    }
]);

module.exports = router;