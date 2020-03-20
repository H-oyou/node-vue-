// @login & register
const express = require('express');
//将数据库引入
const Profile = require('../../models/Profile');
//将passport引入
const passport = require("passport");
// const mongoose = require('mongoose');


// mongoose.set('useFindAndModify', false)

//实例化router
const router = express.Router();

//测试
// @route  GET api/profiles/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    //返回json数据,判断当前是否通了
    res.json({ msg: "profile works" });
});


//添加
// @route  POST api/profiles/add
// @desc   创建信息接口
// @access Private
router.post('/add',passport.authenticate('jwt',{session:false}),(req, res) => {
    const profileFields = {}

    //要进行判断是否存在
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark= req.body.remark
    //如果存储成功就返回
    new Profile(profileFields).save()
        .then(profile => {
            res.json(profile);
        })
});


//获取所有信息
// @route get api/profiles
// @desc   创建信息接口
// @access Private
router.get('/',passport.authenticate('jwt',{session:false}),(req, res) => {
    Profile.find()
        .then(profile => {
            if(!profile) {
                return res.status(404).json("获取的信息不存在")
            }else{
                res.json(profile);
            }
        })
        .catch(err => {
            res.status(404).json(err);
        })
});


//获取单个信息
// @route get api/profiles/:id
// @desc   创建信息接口
// @access Private
router.get('/:id',passport.authenticate('jwt',{session:false}),(req, res) => {
    Profile.findOne({_id:req.params.id})
        .then(profile => {
            if(!profile) {
                return res.status(404).json("获取的信息不存在")
            }else{
                res.json(profile);
            }
        })
        .catch(err => {
            res.status(404).json(err);
        })
});

//删除
// @route delete api/profiles/delete/:id
// @desc   创建删除信息接口
// @access Private
router.delete('/delete/:id',passport.authenticate('jwt',{session:false}),(req, res) => {
   Profile.findOneAndRemove({_id:req.params.id})
        .then(profile => {
            // console.log(profile);
            // 当把某一条删除了,保存一下,然后返回删除的那一条
            // profile.save().then(profile => {
               
            //     return res.json(profile);
            // })
            return res.json(profile);
        })
        .catch(err => {
            return res.status(404).json(err + "删除失败")
        })
});


//编辑
// @route  POST api/profiles/edit:id
// @desc   创建编辑的信息接口
// @access Private
router.post('/edit/:id',passport.authenticate('jwt',{session:false}),(req, res) => {
    const profileFields = {}

    //要进行判断是否存在
    if(req.body.type) profileFields.type = req.body.type;
    if(req.body.describe) profileFields.describe = req.body.describe;
    if(req.body.income) profileFields.income = req.body.income;
    if(req.body.expend) profileFields.expend = req.body.expend;
    if(req.body.cash) profileFields.cash = req.body.cash;
    if(req.body.remark) profileFields.remark= req.body.remark

    //根据id找到并且编辑
    Profile.findOneAndUpdate(
        { _id:req.params.id},
        {$set:profileFields},
        {new:true}
        ).then(profile => {
            res.json(profile)
        })
});

module.exports = router;