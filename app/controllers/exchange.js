
const Controller = loadCore('controller');

const OrderModel = loadModel('OrderModel');
const Token = loadLibrary('Token');
const tokens = loadConfig('tokens');

const Xels = loadLibrary('xels');
const xels = new Xels();

module.exports = class exchange extends Controller {

    constructor() {
        super();
    }


    received(){
        let rows = OrderModel.db.where({'status':0}).get(OrderModel.table,async function (err,rows) {
            if(err){
                console.log(err)
            }else{
                console.log('Found '+rows.length+' Orders for Checking Balance');
                
                for(let row in rows){
                    let ctoken = (globalConfig.cryptoNetwork=='mainnet')?tokens[rows[row].deposit_symbol]:tokens['TEST'];
                    let tokenContract = new Token(
                            ctoken.contract,
                            ctoken.abi,
                            globalConfig.cryptoNetwork
                        );
                    try{
                        let balance = await tokenContract.getBalance(rows[row].deposit_address);
                        if(balance > 0)
                            {
                                OrderModel.db.update(OrderModel.table,{status:1,xels_amount:balance*exchange_rate,deposit_amount:balance},{'id':rows[row].id},function () {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log(`Get token(${balance}) from ${rows[row].id}`);
                                    }
                                })
                            }
                    }catch(err){
                        console.log('Error get '+rows[row].deposit_symbol+' balance of '+rows[row].deposit_address)
                    }
                }
            }
        })
    }
    sendXels(){
        let rows = OrderModel.db.where({'status':1}).get(OrderModel.table,async function (err,rows) {
            if(err){
                console.log(err)
            }else if(rows.length>0){
                console.log('Found Orders for Sending Xels');
                for(let row in rows){
                    await xels.send(rows[row]);
                }
            }
        })
    }
    confirmedSendingXels(){
        let rows = OrderModel.db.where({'status':2}).get(OrderModel.table,function (err,rows) {
            if(err){
                console.log(err)
            }else if(rows.length>0){
                console.log('Found Orders for Confirming Xels');

                for(let row in rows){
                    xels.confirmedSending(rows[row]);
                }
            }
        })
    }

}


