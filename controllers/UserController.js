const UserModel = require('../models/UserModel.js');
const bitcoinService = require('../services/bitcoin.service');
const litecoinService = require('../services/litecoin.service');
const ethereumService = require('../services/ethereum.service');
const eosService = require('../services/eos.service');
const authService = require('../services/auth.service');
const exchangeService = require('../services/exchange.service');
var speakeasy = require('speakeasy');


var mongoose = require('mongoose'),
    User = mongoose.model('User');


// Create and Save a new User
exports.create = async (req, res) => {

    if (req.body.password != null && req.body.email != null && req.body.firstName != null && req.body.lastName != null && req.body.phoneNumber != null && req.body.address != null) {
        var user = new User(req.body);
        UserModel.countDocuments({ email: req.body.email }, async (err, count) => {
            if (count > 0) res.status(400).json({ error: 'exist' });
            else {
                var wallet = {
                    btc: null,
                    ltc: null,
                    eth: null,
                    eos: null,
                    xvg: null
                }

                await bitcoinService.makeWallet().then(
                    (btc) => {
                        wallet.btc = btc;
                    }
                )

                await litecoinService.makeWallet()
                    .then((ltc) => {
                        wallet.ltc = ltc;
                    })

                await ethereumService.makeWallet()
                    .then((eth) => {
                        wallet.eth = eth;
                    })

                await eosService.makeWallet()
                    .then((eos) => {
                        wallet.eos = eos;
                    })

                console.log(wallet);

                var secret = speakeasy.generateSecret({ length: 20 });

                console.log(secret.base32); // Save this value to your DB for the user

                user.secret = secret;

                user.wallets = wallet;

                user.save(function (err, us) {
                    if (err)
                        res.send(err);
                    res.status(200).send({ 'user': us.toWeb(), 'token': us.getJWT() });
                });
            }
        })




    } else {
        res.status(400).json({ error: 'formParsingError' })
    }


};

// Retrieve and return all users from the database.
exports.findAll = async (req, res) => {
    res.status(200).send({ 'status': 'ok' });

};

// Find a single user with a username
exports.findOne = async (req, res) => {

    var authorization = req.headers.authorization,
        decoded;
    console.log(authorization.split(' ')[1]);
    await authService.extractUserFromJWT(authorization.split(' ')[1]).then((usr) => {

        res.status(200).send(usr);
    }).catch((err) => {

        res.send(403).send('error');
    })

};

// Update a user identified by the username in the request
exports.update = (req, res) => {
    res.status(200);
};

// Delete a user with the specified username in the request
exports.delete = (req, res) => {
    res.status(200);
};

exports.login = async (req, res) => {

    const body = req.body;
    let user = {};
    await authService.authUser(body.email, body.password).then((usr) => {
        user = usr;
        res.status(200).send('token needed');
    }).catch(
        (err) => { res.status(403).send(err.message) }
    )




};

exports.login2 = async (req, res) => {

    const body = req.body;
    let user = {};
    var verified;
    await authService.authUser(body.email, body.password).then((usr) => {
        user = usr;
        console.log(user);
        var base32secret = user.secret.base32;
        verified = speakeasy.totp.verify({
            secret: base32secret,
            encoding: 'base32',
            token: req.body.userToken
        });
    }).catch(
        (err) => { console.log(err); res.status(403).send(err) }
    )
    if (!verified)
        res.status(403).send('Unauthorized');
    else res.status(200).send({'user': user.toWeb(), 'token': user.getJWT() });


};

//takes email,password,coin1,coin2,amount
exports.exchange = async (req, res) => {
    const body = req.body;
    let user = {};
    let flag = false;
    await authService.authUser(body.email, body.password).then((usr) => {
        user = usr;
    }).catch(
        (err) => { console.log(err); res.status(403).send(err) }
    );
    //console.log(user);
    await exchangeService.getExchange(body.coin1, body.coin2).then((ratio) => {
        if (user.wallets[body.coin1.toLowerCase()].balance < body.amount) {
            res.status(402).send({ 'err': 'NoBalance' })
        }
        else {
            flag = true;
            user.wallets[body.coin1.toLowerCase()].balance -= parseFloat(body.amount);
            user.wallets[body.coin1.toLowerCase()].spent += parseFloat(body.amount);
            user.wallets[body.coin2.toLowerCase()].balance += (parseFloat(body.amount) * parseFloat(ratio));
        }
    }).catch((err) => { console.log(err); res.status(400) });

    if (flag) {

        user.save(function (err) {
            if (err) { res.status(400).send(err) }
            else {
                res.status(200).send(user.toWeb());
            }
        });
    }

};

exports.getBalance = async (req, res) => {
    var authorization = req.headers.authorization,
        decoded;

    authService.extractUserFromJWT(authorization.split(' ')[1]).then(async (usr) => {

        var blc;
        await ethereumService.getBalance(usr.wallets.eth).then((balance) => {
            console.log(blc);
            blc = balance;
        })

        usr.wallets.eth.balance = blc - usr.wallets.eth.spent;

        usr.save(function (err) {
            if (err) { res.status(400).send(err) }
            else {
                res.status(200).send(usr.toWeb());
            }
        });

    }).catch((err) => {
        console.log(err);
        res.sendStatus(400).send('error');
    })
}

exports.verifToken = (req, res) => {
    res.send({})
}


//
exports.withdraw = (req, res) => {
    const body = req.body;

    var authorization = req.headers.authorization,
        decoded;

    authService.extractUserFromJWT(authorization.split(' ')[1]).then(async (usr) => {

        var blc;
        await ethereumService.getBalance(usr.wallets.eth).then((balance) => {
            console.log(balance);
            blc = balance;
        })

        if (body.amount > blc) res.status(400).send('No Balance');
        else {
            ethereumService.transferETH(usr.wallets.eth, body.amount, body.to).then((tx) => {
                res.json(tx);
            })
        }

    }).catch((err)=>res.status(400).send(err));
}