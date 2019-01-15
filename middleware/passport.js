const { ExtractJwt, Strategy } = require('passport-jwt');
const User = require('../models/UserModel.js');
const CONFIG = require('../config/config');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async function (jwt_payload, done) {
        let err, user;
        User.findById(jwt_payload.user_id).exec((err, user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));

}