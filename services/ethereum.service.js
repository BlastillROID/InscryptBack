var Web3 = require('web3');
var randomstring = require("randomstring");
const EthereumTx = require('ethereumjs-tx')

var web3 = new Web3(new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/e62bf2ea78aa42dc90ebee76cef1a90f'
));

exports.makeWallet = async () => {

    return new Promise((resolve) => {
        var rs = randomstring.generate({
            length: 32,
            charset: 'alphanumeric'
        });

        const acc = web3.eth.accounts.create([rs.toString()])

        wallet = {
            publicKey: acc.address,
            privateKey: acc.privateKey,
            balance: 0,
            spent: 0
        }

        if (acc.address != null && acc.privateKey != null)
            resolve(wallet);

    })

}

exports.transferETH = async (wallet, value, to) => {
    return new Promise((resolve) => {

        web3.eth.getTransactionCount(wallet.publicKey).then((txCount) => {
            let details = {
                "to": to.toString(),
                "value": web3.utils.toHex(web3.utils.toWei(value.toString(), 'ether')),
                "gas": 21000,
                "gasPrice": 2.0 * 1000000000, // converts the gwei price to wei
                "nonce": web3.utils.toHex(txCount)
            }
            
            console.log(details);

            const transaction = new EthereumTx(details)

            transaction.sign(Buffer.from(wallet.privateKey.toString().replace('0x',''), 'hex'))

            const serializedTransaction = transaction.serialize()

            web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
                .once('transactionHash', resolve);

        })
    })
}

exports.getBalance = async (wallet) => {
    return new Promise((resolve) => {
        web3.eth.getBalance(wallet.publicKey).then((balance) => {
            resolve(web3.utils.fromWei(balance, 'ether'));
        })
    })
}


