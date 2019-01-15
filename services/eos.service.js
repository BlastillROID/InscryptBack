const ecc = require('eosjs-ecc');
var randomstring = require("randomstring");


exports.makeWallet = async () => {
    return new Promise(async (resolve) => {
        var rs = randomstring.generate({
            length: 32,
            charset: 'alphanumeric'
        });

        var eosWallet = {}

        const wif = ecc.seedPrivate(rs);

        eosWallet = {
            publicKey: ecc.privateToPublic(wif),
            privateKey: wif,
            balance: 0,
            spent:0
        }
        if (eosWallet.publicKey != null && eosWallet.privateKey != null)
            resolve(eosWallet);
    })




}
