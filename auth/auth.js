const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../model/user');

//json web token
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'cutecat',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use("login", new localStrategy({
   usernameField: "email",
   passwordField: "password" 
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        
        const validate = await user.isValidPassword(password);
        
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
}));

passport.use(
    "signup",
    new localStrategy(
      {
        passReqToCallback: true //allow us to pass req to the callback
      },
      async (req, username, password, done) => {
        User.findOne().or([{email: req.body.email}, {username: req.body.username}])
        .exec(async function(err, foundUser){
          if (err) return done(err);

          if (foundUser == null){
            let newUser = await User.create({
              username: req.body.username,
              fullname: req.body.fullname,
              email: req.body.email,
              password: req.body.password,
              city: req.body.city,
              country: req.body.country,
              word_collections: [],
              news_collection: []
            });

            return done(null, newUser);
          }
          else{
            return done(null, false, {message: "user already exists"});
          }
        });
      }
    )
);