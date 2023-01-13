import User from '../models/UserModel.js';
import JwtStrategy from 'passport-jwt/lib/strategy.js';
import { ExtractJwt } from 'passport-jwt';

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'mysecrettoken';
opts.secretOrKey = process.env.JWT_SECRET;
export const PassportFunc = (passport) => {
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findById(jwt_payload._id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}
