const Controller = loadCore('controller');

const OrderModel = loadModel('OrderModel');
const env = loadENV();
const axios = require("axios");
const feeType ='medium';
module.exports = class exchange extends Controller {

    constructor() {
        super();
    }


    send(order){

        let xels_address = order.xels_address;
        let amount = order.xels_amount;
        
        return new Promise((resolve,reject)=>{
            estimateFee(xels_address).then(fee => {
                let estimatedfee = fee.InnerMsg/100000000;
                BuildTransaction(xels_address,amount,estimatedfee).then(hexData => {
                    let hexString = hexData.InnerMsg.hex;
                    SendTransaction(hexString).then(success => {
                        let txid = success.InnerMsg.transactionId;
                        updateStatus(order.id, txid);
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log(err);
                });

            }).catch(err => {
                console.log(err);
            });



        });
    }


    confirmedSending (order)
    {
        let txID = order.transaction_id;
        return new Promise((resolve,reject) => {
            const prm = {
                'URL' : '/api/wallet/historyById',
                'walletName' : env.walletName,
                'accountName' : env.account,
                'Id': txID
            }
            axios.get(env.baseXels + env.GetApiURL, {params: prm}).then(response => {

                let history = response.data.InnerMsg.history[0].transactionsHistory;
                let successObj = {
                    "statusCode" : response.status,
                    "statusText" : response.statusText,
                    "InnerMsg" : history
                }
                if(history.length > 0 && history[0].confirmedInBlock)
                {
                    CompleteOrder(order.id);
                }

            }).catch(error => {
                console.log('ERROR FROM getTxInfo()');
                console.log(error);
                let errObj ={
                    "statusCode" : error.response.status,
                    "statusText" : error.response.statusText,
                    "InnerMsg" : error.response.data.errors ? error.response.data.errors : ""
                }

                reject(errObj);
            });
        });
    }

}

function updateStatus (id,txid)
{
    OrderModel.db.update(OrderModel.table,{transaction_id:txid,status:2},{id},function (err,res) {
        if(err){
            console.log(err);
        }
    })
}

function CompleteOrder (id)
{
    OrderModel.db.update(OrderModel.table,{status:3},{id:id},function (err,res) {
        if(err){
            console.log(err);
        }
    })
}

function estimateFee(xels_address)
{
    return new Promise((resolve,reject) => {

        const prm = {
            'URL' : '/api/wallet/estimate-txfee',
            'walletName' : env.walletName,
            'accountName' : env.account,
            'allowUnconfirmed': true,
            'feeType' : feeType,
            'allowUnconfirmed' :  true,
            'recipients[0][destinationAddress]': xels_address,
            'recipients[0][amount]':200
        }
        axios.get(env.baseXels + env.GetApiURL, {params: prm}).then(response => {
            resolve(response.data);
        }).catch(error => {
            console.log('ERROR FROM estimateFee()');
            //console.log("estimateFee" +error );
            reject(error.response.data);
        });
    });
}
function BuildTransaction(xels_address,amount,estimatedfee)
{
    return new Promise((resolve,reject)=>{
        const pram = {
            URL : '/api/wallet/build-transaction',
            accountName : env.account,
            allowUnconfirmed: true,
            recipients:[{
                amount: amount,
                destinationAddress: xels_address } ],
            walletName : env.walletName,
            feeAmount: estimatedfee,
            password :  env.walletPw,
            shuffleOutputs: false
        };
        axios({ method: 'post', url: env.baseXels + env.PostAPIURl, data: pram})
            .then(response => {
                resolve(response.data);
            }).catch(error => {
            console.log('ERROR FROM BuildTransaction()');
            reject(error.response.data);
        });
    })
}

function SendTransaction(hex)
{
    return new Promise((resolve,reject)=>{
        const prm = {
            URL: '/api/wallet/send-transaction',
            hex: hex
        };

        axios({ method: 'post', url: env.baseXels + env.PostAPIURl, data: prm})
            .then(response => {
                //console.log(response.data);
                resolve(response.data);
            }).catch(error => {
            console.log('ERROR FROM SendTransaction()');
            reject(error);
        });
    });

}

function searchTxID(tid , historyArr)
{
    //console.log(tid);
    let data = historyArr.find(x => x.id === tid);
    return data;
}


