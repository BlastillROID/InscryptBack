var litecore = require('litecore-lib');

var request = require("request");

// acc 2 : privKey: 91yTueY6k5PGv2ZHAtm7jqEJoinC1kdQayiRfum8hKs9uheNTTX
// acc 2 : publKey: mza3VBPonG27JjHUriHxydPaABPaP5GxJ7


function rng() { return Buffer.from('32LengthBufferGeneratePrivateKey') }

const keyPair = litecore.PrivateKey(rng(), "testnet")

const privateKey = keyPair.toWIF();

const adr = keyPair.toAddress();

address = adr.toString();

console.log(address)


getUTXOs(address)
    .then((utxos) => {

        let balance = 0;
        for (var i = 0; i < utxos.length; i++) {
            balance += utxos[i]['satoshis'];
        } //add up the balance in satoshi format from all utxos
        // 1 Satoshi = 100,000,000 LTC

        var fee = 150000; //fee for the tx
        //500000000,
        //100000000,
        //15000000
        var tx = new litecore.Transaction() //use litecore-lib to create a transaction
            .from(utxos)
            .to('mza3VBPonG27JjHUriHxydPaABPaP5GxJ7', 100000000) //note: you are sending all your balance AKA sweeping
            .fee(fee)
            .change(address)
            .sign(privateKey)
            .serialize()
        //console.log(tx)
        return broadcastTX(tx) //broadcast the serialized tx
    })
    .then((result) => {
        console.log(result) // txid
    })
    .catch((error) => {
        console.log(error.toString())
    })
















//manually hit an insight api to retrieve utxos of address
//https://insight.litecore.io/api/addr/ for mainnet
function getUTXOs(address) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://testnet.litecore.io/api/addr/' + address + '/utxo',
            json: true
        },
            (error, response, body) => {
                if (error) reject(error);
                resolve(body)
            }
        )
    })
}

//manually hit an insight api to broadcast your tx
function broadcastTX(rawtx) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://chain.so/api/v2/send_tx/LTCTEST',
            method: 'POST',
            json: {
                tx_hex:rawtx
            }
        },
            (error, response, body) => {
                //console.log(response)
                if (error) reject(error);
                resolve(body.data.txid)
            }
        )
    })
}

// getUTXOs(address)
//     .then((utxos) => {

//         let balance = 0;
//         for (var i = 0; i < utxos.length; i++) {
//             balance += utxos[i]['satoshis'];
//         } //add up the balance in satoshi format from all utxos

//         var fee = 1500; //fee for the tx
//         var tx = new Litecoin.Transaction() //use litecore-lib to create a transaction
//             .from(utxos)
//             .to('TO_ADDRESS', balance - fee) //note: you are sending all your balance AKA sweeping
//             .fee(fee)
//             .sign(privateKey)
//             .serialize();

//         return broadcastTX(tx) //broadcast the serialized tx
//     })
//     .then((result) => {
//         console.log(result) // txid
//     })
//     .catch((error) => {
//         throw error;
//     })