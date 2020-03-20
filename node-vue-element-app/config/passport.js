const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require("mongoose");
const User = require("../models/User");
// const User = mongoose.model("users");


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';





module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //当token验证成功,打印以下语句会输出注册的那个用户的id和名字(因为在设置token规则的时候就用的id和名字)
            //{
            // id: '5e6d8f034e0bb164b08434a7',
            // name: '小黑',
            // iat: 1584273647,
            // exp: 1584277247
            // }
        // console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null, user);
                }
                return done(null, false); //没有用户就返回false
            })
            .catch(err => {
                console.log(err);
            })
    }));
}