var randomstring = require("randomstring");
var litecore = require('litecore-lib');
var request = require("request");

exports.makeWallet = async () => {

    return new Promise((resolve) => {
        var rs = randomstring.generate({
            length: 32,
            charset: 'alphanumeric'
        });

        function rng() { return Buffer.from(rs.toString()) }

        const keyPair = litecore.PrivateKey(rng(), "testnet")

        const ltcWallet = {
            publicKey: keyPair.toAddress().toString(),
            privateKey: keyPair.toWIF(),
            balance: 0,
            spent:0
        }

        //console.log(ltcWallet);

        if (ltcWallet.publicKey != null && ltcWallet.privateKey != null)
            resolve(ltcWallet);
    })

}

exports.transferLTC = async (wallet, value, to) => {
    return new Promise((resolve) => {
        getUTXOs(wallet.publicKey)
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
                    .to(to, value * 1e8) //note: you are sending all your balance AKA sweeping
                    .fee(fee)
                    .change(wallet.publicKey)
                    .sign(wallet.privateKey)
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
    })
}














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
                tx_hex: rawtx
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