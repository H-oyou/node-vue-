// @login & register
const express = require('express');
//将数据库引入
const User = require('../../models/User');
//将bcrypt引入
const bcrypt = require('bcrypt');
//将gravatar引入
const gravatar = require('gravatar');
//将jwt引入
const jwt = require('jsonwebtoken');
//将passport引入
const passport = require("passport");


//实例化router
const router = express.Router();

// @route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    //返回json数据,判断当前是否通了
    res.json({ msg: "login works" });
});


// @route  POST api/users/register  -->注册时用POST请求,因为要传递很多数据
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
    //可用postman试一试能否请求成功
    // console.log(req.body);

    //查询数据库中是否拥有邮箱,查询一条用findOne
    User.findOne({email:req.body.email})
        .then((user) => {
            //如果查询到了就返回一个状态400,邮箱已被注册
            if(user) {
                return res.status(400).json("邮箱已被注册")
            }else{
                //获取头像avatar,用gravatar.url第一个参数是邮箱,第二参数是对象
                //s是大小,r就是图片的格式->这个格式和你在gravatar中选择的格式要保持一致,d->default默认是404报错,我们换成mm(mm就是一个头像)
                //之后向数据库添加的数据有一个avatar属性,属性值是一个网址,在浏览器打开网址,
                //req.body.email这个地址如果没有在gravatar网站注册过,这个头像就是默认的,如果在gravatar注册过,就是自己在gravatar上传过的图片
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                //邮箱没有被注册,就创建一个新用户
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    avatar,    //avatar是全球公认头像,需要通过第三方gravatar来进行处理
                    identity:req.body.identity,
                    password:req.body.password
                })

                //要对密码进行加密,需要安装bcrypt npm install bcrypt 然后引入再使用
                bcrypt.genSalt(10, function(err,salt) {
                    //对newUser.password进行加密,hash就是加密后的密码
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) {
                            throw err;
                        }else {
                            //将hash赋给密码,给密码加密
                            newUser.password = hash;
                        }
                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                    })
                })
            }
        })
    // res.json({ msg: 'login works' });
});



// @route  POST api/users/login -->登录时也用POST请求
// @desc   返回的token jwt passport
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //查询数据库email是否存在-->存在再判断密码是否正确
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json("用户不存在");
            }

            //如果用户存在再对密码进行匹配,还是要用到bcrypt中的bcrypt.compare,注册密码加密用的是bcrypt.genSalt
            //第一个参数是定义的password即前端输入的passwo,第二参数是数据库中的password
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            //token就是一种认证机制,让后端知道是来自合法的客户端
                            //当用户第一次向服务器发送请求时,服务器会给客户一个token,就是一个表明身份的字符串
                            //之后用户每次向服务器发送请求都会带上这个token,让服务器知道是合法的客户端
                            //token就相当于一个钥匙,当登录成功服务器返回一个token,下次每一次向服务器请求数据时必须要带着这个钥匙去请求
                            // jwt.sign("规则","加密的名字","过期时间","箭头函数")
                            //定义规则:这里就用两个id和name,当然可以给的更多,可以加上email等
                            const rule = {
                                id:user.id,
                                name:user.name,
                                avatar:user.avatar,
                                identity:user.identity
                            }
                            //这里设置了过期时间是3600s就是一个小时,如果成功就返回xiaohei+id+name
                            jwt.sign(rule,"secret",{expiresIn:3600}, (err, token) => {
                                if(err) throw err;
                                res.json({
                                    sucess:true,
                                    //这里的token值必须是Bearer +token值,否则验证是通不过的
                                        // token:"xiahei" + token
                                    token:"Bearer " + token
                                })
                            })
                            // 这里并不会返回sucess
                                // res.json({msg:"success"});
                        }else{
                            return res.status(400).json("密码错误!");
                        }
                    })
        })
})



// @route  POST api/users/current 假设当前用户请求数据
// @desc   return current user
// @access Private (私密的,只有验证通过才能请求)
    // router.get("/current","验证token,验证token需要passport-jwt", (req, res) => {
    //     res.json({msg: "sucess"})
    // })

router.get("/current", passport.authenticate("jwt",{session:false}),(req, res) => {
    // res.json({msg:"认证通过success"})
    //当验证成功,在passport中返回的是user,所以这里可以返回user.id,user.name,user.email
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    })
})
module.exports = router;