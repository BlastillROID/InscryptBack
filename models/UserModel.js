const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('mongoose-validator');
const CONFIG = require('../config/config');


const UserSchema = mongoose.Schema({

    password: String,
    secret: mongoose.Schema.Types.Mixed,
    email: { type: String, unique: true, required: true },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    address: {
        country: String,
        city: String,
        street: String,
        houseNumber: String
    },
    wallets: {
        btc: {
            balance: Number,
            spent: Number,
            publicKey: String,
            privateKey: String,
        },

        ltc: {
            balance: Number,
            spent: Number,
            publicKey: String,
            privateKey: String,
        },
        eth: {
            balance: Number,
            spent: Number,
            publicKey: String,
            privateKey: String,
        },
        xvg: {
            balance: Number,
            spent: Number,
            publicKey: String,
            privateKey: String,
        },
        eos: {
            balance: Number,
            spent: Number,
            publicKey: String,
            privateKey: String,
        }
    }

}, {
        timestamps: true
    });


UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (pw) {
    return bcrypt.compareSync(pw, this.password);
}

UserSchema.methods.getJWT = function () {
    let expiration_time = CONFIG.jwt_expiration;
    let jwt_encryption = CONFIG.jwt_encryption;
    return "Bearer " + jwt.sign({ user_id: this._id }, jwt_encryption, { expiresIn: expiration_time });
};
UserSchema.methods.toWeb = function () {
    let json = this.toJSON();
    json.id = this._id;//this is for the front end
    return json;
};


module.exports = mongoose.model('User', UserSchema);