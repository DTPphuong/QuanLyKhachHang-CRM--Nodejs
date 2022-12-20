'use strict';

const bcrypt = require('bcrypt');
const constant = require('./../constant');
const { findBy } = require('./../../user/database/data');
const dataHandle = require('./../../_helper/dataHandle');

const noLogin = async (req, res, next) => {
    try{
        // check session
        if(req.session.user){
            const user = await findBy({
                id: req.session.user
            });
            if(user){
                req.user = user;
                res.redirect('/dashboard');
            } else {
                next()
            }
        } else {
            next();
        }
    } catch (e) {
        console.log('err', e);
        res.render('pages/error/500');
    }
};
//Cho phep vao trang xac thuc OTP
const isActiveUserActon = async (req, res, next) => {
    try{
        //neu co user thi next
        if(req.session.active_user){
            next();
        }else{
        //neu khong co thi tra ve trang signin
        res.redirect('/auth/signin');
        }
    } catch (e) {
        console.log('err', e);
        res.render('pages/error/500');
    }
};

const mustLogin = async (req, res, next)=>{
    try{
        // check session 
        if(req.session.user){
            //tim kiem user tren he thong
            const user = await findBy({
                id: req.session.user
            });
            //neu co user thi next
            if(user){
                req.user = user;
                next();
            }else{
                req.session.user = null;
                res.redirect('/auth/signin');
            }
        }else{
            res.redirect('/auth/signin');
        }

    } catch (e) {
        console.log('err', e);
        res.render('pages/error/500');
    }
};


module.exports = {
    isActiveUserActon,
    noLogin,
    mustLogin,
};