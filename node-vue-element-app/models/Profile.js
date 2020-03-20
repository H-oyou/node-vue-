const mongoose = require('mongoose');

//创建表规则
let Schema = mongoose.Schema;  //获取创建表规则的构造函数

//新建一个具体的表规则
let ProfileSchema = new Schema({
    type:{
        type:String,
    },
    //描述
    describe:{
        type:String,
    },
    //收入
    income:{
        type:String,
        required:true
    },
    //支出
    expend:{
        type:String,
        required:true
    },
    //账户现金
    cash:{
        type:String,
        required:true
    },
    //备注
    remark:{
        type:String,
    },
    //创建时间
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Profile = mongoose.model('profile',ProfileSchema);
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
