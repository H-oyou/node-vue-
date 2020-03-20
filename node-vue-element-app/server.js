const express = require('express');
//实例化express对象
const app = express();

//引入body-parse
const bodyParser = require('body-parser');
//使用body-parse中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//引入passport并且初始化
const passport = require("passport");
app.use(passport.initialize());
//在单独的文件中配置passport,将其引入,最后一个passport是初始化上面那一行定义的passport
require("./config/passport")(passport);

//引入users.js
const users = require('./routes/api/users');
//引入profiles
const profiles = require('./routes/api/profiles');

//引入数据库
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)


//链接数据库,如果没有就建立,如果有就连接有的-->mongode://127.0.0.1:27017/这一块是固定的,后面的test是数据库名字
//test如果有就连接有的,如果没有就新建立一个test数据库
mongoose.connect('mongodb://127.0.0.1:27017/test',{
    //以下两句是关于解析的,建议加上
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('连接成功');
}).catch((err) => {
    console.log('连接失败'+err);
})


//使用routes
app.use('/api/users',users);
app.use('/api/profiles',profiles);



//设置端口号,如果是本地开发环境就5000,
//在许多环境中（例如Heroku），作为惯例，可以设置环境变量PORT来告诉Web服务器要监听的端口
//所以无论通过环境变量PORT还是5000都可以访问这个端口
const port = process.env.PORT || 5000;

//设置路由当是主路径时,返回hello world
app.get('/',(req,res) => {
    res.send('hello world')
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})