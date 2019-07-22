const Controller = loadCore('controller');


module.exports = class homeController extends Controller {

    constructor() {
        super();
    }

    submit(){
        const OrderModel = loadModel('OrderModel');
        let data = {
            xels_address : RequestData.post('xels_address',true).type('string').value,
            eth_token_amount : RequestData.post('eth_token_amount',true).value,
            xels_amount : RequestData.post('xels_amount',true).value
        };
        let Eth_wallet = loadLibrary('addrs/eth');
        Eth_wallet.getWallet().then(wallet=>{
            data.eth_address = wallet.public;
            data.eth_pvt = wallet.private;

            OrderModel.db.insert(OrderModel.table,data,function (err,insert) {
                let random = require("randomstring");
                let order_no = random.generate(7)+insert.insertId;
                OrderModel.db.update(OrderModel.table,{order_no},{id:insert.insertId},function (err,update) {
                    Response.redirect('/track?eid='+order_no);
                })
            })
        })




    }

    order(){
        const OrderModel = loadModel('OrderModel');
        let order_no = RequestData.get('eid',false).value;
        if(order_no){
            OrderModel.db.where({order_no}).get(OrderModel.table,function (err,data) {
                if(data.length>0){
                    Response.render('pages/order',{order:data[0]});
                }else{
                    Response.render('pages/order',{order:data,error:{message:`"${order_no}" is not found in order list! Please input current exchange id`}});
                }
            })
        }else{
            Response.render('pages/order');
        }


    }

    //public api response
    getOrder(){
        const OrderModel = loadModel('OrderModel');
        OrderModel.db.select([
            'order_no as id',
            'xels_address',
            'eth_address',
            'xels_amount',
            'eth_token_amount',
            'transaction_id',
            'status'
        ]);
        OrderModel.db.where({'order_no':RequestData.param('order_no',true).value}).get(OrderModel.table,function (err,data) {
            Response.send(data[0]);
        })
    }

}


