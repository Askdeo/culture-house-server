const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
       User.findByPk(jwt_payload.id)
        .then(user => {
            if(!user) {
                return done(null, false);
            }
            return done(null, user);
        })
        .catch(err => {
            console.log(err);
        });
    }));
}