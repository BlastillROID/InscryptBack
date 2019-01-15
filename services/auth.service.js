const User = require('../models/UserModel');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const authUser = async function (email, password) {//returns token
    return new Promise((resolve, reject) => {
        let auth_info = {};
        auth_info.status = 'login';
        if (!email) reject(new Error("Invalid or empty email"));
        if (!password) reject(new Error("Invalid or empty password"));
        if (validator.isEmail(email)) {
            User.findOne({ 'email': email }).exec((err, user) => {
                if (err) throw err;
                else if (!user) reject(new Error('Not registered'));
                else {
                    flag = user.comparePassword(password);
                    if (!flag) reject(new Error("Wrong Password"));
                    else
                        resolve(user);
                }
            })

        } else {
            reject(new Error( "Invalid email"));
        }
    });

}
module.exports.authUser = authUser;


const extractUserFromJWT = function (authorization) {
    return new Promise((resolve, reject) => {
        try {
            decoded = jwt.verify(authorization, CONFIG.jwt_encryption);
        } catch (e) {
            console.log(e);
            reject(new Error('unauthorized'));
        }
        var userId = decoded.user_id;
        User.findOne({ _id: userId }).then(function (user) {
            resolve(user);
        });
    })
}

module.exports.extractUserFromJWT = extractUserFromJWT;