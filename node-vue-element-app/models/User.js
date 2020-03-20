const mongoose = require('mongoose');

//创建表规则
let Schema = mongoose.Schema;  //获取创建表规则的构造函数

//新建一个具体的表规则
//字段名字,email 头像avatar, 时间
let UserSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    //全球公认头像字段
    avatar:{
        type:String
    },
    //身份字段
    identity:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = User = mongoose.model('users',UserSchema);
//新建一个表(如果表存在就连接,不存在就新建)
//mongoose.model(表名,表规则)
    // const gfs = mongoose.model('gfs',gfsSchema);

    // //创建条目,可以添加很多数据
    // gfs.create({
    //     name:"乔碧螺",
    //     age:18,
    //     sex:'女',
    //     height:188
    // }).then(() => {
    //     console.log('添加数据成功');
    // })
