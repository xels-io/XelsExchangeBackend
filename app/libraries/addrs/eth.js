let Accounts = require('ethereumjs-wallet');
exports.getWallet = () =>{
    return new Promise((resolve,reject)=>{
        let acc = Accounts.generate();
        let wallet ={
            'network':'mainnet',
            'public':acc.getAddressString(),
            'private':acc.getPrivateKeyString()
        };
        resolve(wallet);
    });
};
