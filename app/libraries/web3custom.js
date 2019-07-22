let config = require('../../config/config');
let env = require('../../env');
let web3 = require('web3');

if(config.cryptoNetwork == 'testnet'){
    web3 = new web3(new web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${env.web3ProviderApi}`));
}else{
    web3 = new web3(new web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${env.web3ProviderApi}`));
}

exports.web3 = web3;