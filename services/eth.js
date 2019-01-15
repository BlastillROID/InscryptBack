var Web3 = require('web3');

const EthereumTx = require('ethereumjs-tx')

var web3 = new Web3(new Web3.providers.HttpProvider(
    'http://127.0.0.1:8545'
));


// to create account
//web3.eth.accounts.create(['12345678123456781234567812345678'])

web3.eth.getTransactionCount('0x481dd4ec8c1bf1d0f97e9f7efc3fe5a4d78766be').then((txCount) => {
    let details = {
        "to": '0x79E65469CAd6997A6E23C5a75BDaa6aAbD447480',
        "value": web3.utils.toHex(web3.utils.toWei('1', 'ether')),
        "gas": 21000,
        "gasPrice": 2.0 * 1000000000, // converts the gwei price to wei
        "nonce": web3.utils.toHex(txCount)
    }

    const transaction = new EthereumTx(details)

    transaction.sign(Buffer.from('a5601c97ff8d03ea220b7d612e0626d956562f1e0bff6593033d1ee4c603b124', 'hex'))

    const serializedTransaction = transaction.serialize()

    web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
        //.once('transactionHash', console.log)
        .once('receipt', console.log)
    //.on('confirmation', console.log)

})





