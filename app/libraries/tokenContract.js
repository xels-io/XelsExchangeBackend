let web3 = loadLibrary('web3custom').web3;
let token = loadConfig('tokens').token;
let contractABI = token.abi;
let contractAddress = token.contract;

let tokenContract = new web3.eth.Contract(contractABI,contractAddress);

exports.tokenContract = tokenContract;

const getBalance = (address) =>{
    return new Promise((resolve,reject)=>{
        let tokenContract = new web3.eth.Contract(contractABI,contractAddress);
        tokenContract.methods.balanceOf(address).call()
            .then(function(result){
                fromUnit(result).then(amount=>{
                    resolve(amount);
                })
            }).catch(e=>{
                //console.log('ERROR WHILE GETTING BALANCE OF TOKEN');
                //console.log(e);
            });
    })
};
exports.getBalance =getBalance;

const getDecimals = () =>{
    return new Promise((resolve,reject)=>{
        tokenContract.methods.decimals().call().then(decimals=>{
            resolve(decimals);
        });
    })
};
exports.getDecimals =getDecimals;

const getUnit = () =>{
    return new Promise((resolve,reject)=>{
        getDecimals().then(function(decimals){
            if(decimals != 0){
                let des = '0';
                des = parseFloat('0.'+des.repeat(decimals-1)+'1');
                resolve(des);
            }else{
                resolve(1);
            }

        })
    });
};
exports.getDecimals =getDecimals;
exports.getName = () =>{
    return new Promise((resolve,reject)=>{
        tokenContract.methods.name().call().then(name=>{
            resolve(name);
        });
    })
};
const toUnit = (amount) => {
    return new Promise((resolve,reject)=>{
        getUnit().then(function(unit){
            resolve(Math.ceil(amount/unit));
        })
    });

};
exports.toUnit = toUnit;

const fromUnit = (amount) => {
    return new Promise((resolve,reject)=>{
        getUnit().then(function(unit){
            resolve(amount*unit);
        })
    });

};
exports.fromUnit = fromUnit;

const symbol = ()=>{
    return new Promise((resolve,reject)=>{
        tokenContract.methods.symbol().call().then(name=>{
            resolve(name);
        });
    })
};
exports.symbol = symbol;

const transfer = (fromAddress,pKey,toAddress,sendAmount,nonceInc=0) =>{
    return new Promise((resolve,reject)=>{
        let tx = loadLibrary('transaction/transethtoken');
        tx.send(fromAddress,pKey,toAddress,sendAmount,nonceInc).then(transaction=>{
            resolve(transaction);
        }).catch(e=>{
            reject(e);
        })

    })
}
exports.transfer = transfer;
