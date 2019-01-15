var bitcoin = require("bitcoinjs-lib")

var bitcoinTransaction = require('bitcoin-transaction');

const testnet = bitcoin.networks.testnet

function rng() { return Buffer.from('32LengthBufferGeneratePrivateKey') }

function rng2() { return Buffer.from('32LengthBufferGeneratePriv@teKey') }

const keyPair = bitcoin.ECPair.makeRandom({ network: testnet, rng: rng })

const keyPair2 = bitcoin.ECPair.makeRandom({ network: testnet, rng: rng2 })

console.log(keyPair.toWIF());

console.log(keyPair2.toWIF());

const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: testnet })

var address2 = bitcoin.payments.p2pkh({ pubkey: keyPair2.publicKey, network: testnet }).address


console.log('from: '+address)

console.log('to: '+ address2)

bitcoinTransaction.getBalance(address2, { network: "testnet" })
    .then((balanceInBTC) => {
        console.log(balanceInBTC);
    })

    bitcoinTransaction.getBalance(address, { network: "testnet" })
    .then((balanceInBTC) => {
        console.log(balanceInBTC);
    })

// bitcoinTransaction.sendTransaction({
//     from: address,
//     to: address2,
//     privKeyWIF: keyPair.toWIF(),
//     btc: 0.5,
//     network: "testnet"
// });
