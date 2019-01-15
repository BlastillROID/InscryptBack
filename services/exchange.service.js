const request = require('request');

exports.getExchange = async (coin1, coin2) => {
    return new Promise((resolve, reject) => {
        let c1 = coin1.toUpperCase();
        let c2 = coin2.toUpperCase();
        request('https://min-api.cryptocompare.com/data/price?fsym=' + c1 + '&tsyms=' + c2,
            { json: true }, (err, res) => {
                if (err) { throw err }
                else if (res.body) {
                    console.log(res.body[c2])
                    resolve(res.body[c2]);
                }
            });
    })
}