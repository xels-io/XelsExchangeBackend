
const Controller = loadCore('controller');

const OrderModel = loadModel('OrderModel');
const tokenContract = loadLibrary('tokenContract');
const Xels = loadLibrary('xels');
const xels = new Xels();

module.exports = class exchange extends Controller {

    constructor() {
        super();
    }


    received(){
        let rows = OrderModel.db.where({'status':0}).get(OrderModel.table,function (err,rows) {
            if(err){
                console.log(err)
            }else{
                console.log('Found Orders for Checking Balance');
                for(let row in rows){
                    tokenContract.getBalance(rows[row].eth_address )
                        .then(function(balance){
                            if(balance > 0)
                            {
                                OrderModel.db.update(OrderModel.table,{status:1,xels_amount:balance*exchange_rate,eth_token_amount:balance},{'id':rows[row].id},function () {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log(`Get token(${balance}) from ${rows[row].id}`);
                                    }
                                })
                            }
                        });
                }
            }
        })
    }
    sendXels(){
        let rows = OrderModel.db.where({'status':1}).get(OrderModel.table,function (err,rows) {
            if(err){
                console.log(err)
            }else if(rows.length>0){
                console.log('Found Orders for Sending Xels');
                for(let row in rows){
                    xels.send(rows[row]);
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


