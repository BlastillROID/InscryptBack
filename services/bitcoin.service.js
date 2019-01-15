var randomstring = require("randomstring");
var bitcoin = require("bitcoinjs-lib")
var bitcoinTransaction = require('bitcoin-transaction');
const testnet = bitcoin.networks.testnet



exports.makeWallet = async () => {
    return new Promise((resolve) => {
        var rs = randomstring.generate({
            length: 32,
            charset: 'alphanumeric'
        });

        function rng() { return Buffer.from(rs.toString()) }

        const keyPair = bitcoin.ECPair.makeRandom({ network: testnet, rng: rng })

        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet })

        const wif = keyPair.toWIF();

        const btcWallet = {
            publicKey: address,
            privateKey: wif,
            balance: 0,
            spent:0
        }

        //console.log(btcWallet);

        if (btcWallet.publicKey != null && btcWallet.privateKey != null)
            resolve(btcWallet);
    })
}

exports.getBalance = (address) => {
    return bitcoinTransaction.getBalance(address, { network: "testnet" });
}

exports.transferBTC = (wallet, value, to) => {
    bitcoinTransaction.sendTransaction({
        from: wallet.publicKey,
        to: to,
        privKeyWIF: wallet.privateKey,
        btc: value,
        network: "testnet"
    });
}





