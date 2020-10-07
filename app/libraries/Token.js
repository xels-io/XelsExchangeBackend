let env = require('../../env');
module.exports = class Token {

    constructor(contractAddress,abi,network='mainnet'){
        this.contractAddress = contractAddress;
        this.network = network;
        let web3 = require('web3');
        if(network == 'testnet'){
            this.web3 = new web3(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/"+env.web3ProviderApi));
        }else{
            this.web3 = new web3(new web3.providers.HttpProvider("https://mainnet.infura.io/v3/"+env.web3ProviderApi));
        }
        this.contract = new this.web3.eth.Contract(abi,contractAddress);
        this.gasLimit = 60000;
    }

    getTotalSupply(){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.contract.methods.totalSupply().call()
                .then(function(result){
                    _this.fromUnit(result).then(amount=>{
                        resolve(amount);
                    })
                }).catch(err=>{
                reject(err)
            });
        })
    }

    getBalance(address){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.contract.methods.balanceOf(address).call()
                .then(function(result){
                    _this.fromUnit(result).then(amount=>{
                        return resolve(amount);
                    }).catch(err=>{
                        return reject(err)
                    })
                }).catch(err=>{
                    return reject(err)
            });
        })
    }

    getDecimals(){
        return new Promise((resolve,reject)=>{
            this.contract.methods.decimals().call().then(decimals=>{
                resolve(decimals);
            });
        })
    }

    getUnit(){
        return new Promise((resolve,reject)=>{
            this.getDecimals().then(function(decimals){
                if(decimals != 0){
                    let des = '0';
                    des = parseFloat('0.'+des.repeat(decimals-1)+'1');
                    resolve(des);
                }else{
                    resolve(1);
                }

            })
        });
    }

    getName(){
        return new Promise((resolve,reject)=>{
            this.contract.methods.name().call().then(name=>{
                resolve(name);
            });
        })
    }

    toUnit(amount){
        return new Promise((resolve,reject)=>{
            this.getUnit().then(function(unit){
                resolve(Math.ceil(amount/unit));
            }).catch(err=>{
                reject(err);
            })
        });

    };

    fromUnit(amount){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.getUnit().then(function(unit){
                resolve(amount*unit);
            }).catch(err=>{
                reject(err)
            })
        });

    };

    getSymbol(){
        return new Promise((resolve,reject)=>{
            this.contract.methods.symbol().call().then(name=>{
                resolve(name);
            });
        })
    };

    isAddress(address){
        let format = /^0x[0-9a-fA-F]{40}$/;
        return format.test(address);
    }


    transfer (fromAddress,pKey,toAddress,amount){
        let resData = {
            error : -1,
            message : null,
            txId : null,
        }
        return new Promise((resolve,reject)=>{

            let Tx = require('ethereumjs-tx');

            if(pKey.length==66){
                pKey = pKey.substr(2, pKey.length);
            }

            let fromPkeyB = Buffer.from(pKey,'hex');

            if(this.isAddress(toAddress)){
                toAddress = this.web3.utils.toChecksumAddress(toAddress);
            }
            if(this.web3.utils.isAddress(toAddress)){

                let myContract = this.contract;
                this.toUnit(amount).then(sendAmount=>{
                    let data = myContract.methods.transfer(toAddress, sendAmount).encodeABI();
                    this.web3.eth.getBalance(fromAddress,(err,balance)=>{
                        if(err){
                            reject(err);
                        }else{
                            this.web3.eth.getTransactionCount(fromAddress).then(nonce=>{

                                this.web3.eth.getGasPrice()
                                    .then((gasPrice)=>{

                                        if(balance >= this.gasLimit*gasPrice){
                                            let rawTx = {
                                                "nonce": this.web3.utils.toHex(nonce),
                                                "gasPrice": this.web3.utils.toHex(parseInt(gasPrice)),
                                                "gasLimit": this.web3.utils.toHex(this.gasLimit),
                                                "to": this.contractAddress,
                                                "value": "0x00",
                                                "data": data
                                            };
                                            if(this.network=='mainnet'){
                                                rawTx.chainId = this.web3.utils.toHex(1); //mainnet
                                            }else{
                                                rawTx.chainId = this.web3.utils.toHex(4); //4=rinkeby 42=kovan
                                            }

                                            const tx = new Tx(rawTx);
                                            tx.sign(fromPkeyB);
                                            let serializedTx = "0x" + tx.serialize().toString('hex');

                                            this.web3.eth.sendSignedTransaction(serializedTx,(err,res)=>{
                                                if(err){
                                                    console.log(err);
                                                    resData.error = 1;
                                                    resData.message = 'Private key does not match or network error at broadcasting ETH.';

                                                    reject(resData);
                                                    return false;
                                                }else{
                                                    resData.error = 0;
                                                    resData.message = 'Token has been sent Successfully.';
                                                    resData.txId = res;
                                                    resolve(resData);

                                                }
                                            });
                                        }// if balance is available
                                        else{
                                            resData.error = 1;
                                            resData.message = 'Insufficient balance for gas.';
                                            reject(resData);
                                        }

                                    }); //getGasPrice

                            })//get nonce
                        }

                    });//get balance
                })//amount convert to Unit value

            }// if address is valid
            else{
                resData.error = 1;
                resData.message = `Invalid Address to send (${toAddress})`;
                reject(resData);
            }


        })
    }
}
