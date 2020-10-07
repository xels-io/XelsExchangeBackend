const Controller = loadCore('controller');
let $this;

module.exports = class homeController extends Controller {

    constructor() {
        super();
        $this = this;
    }



    submit(Request,Response){
        const OrderModel = loadModel('OrderModel');
        let RequestData = loadValidator(Request,Response);
        let data = {
            xels_address : RequestData.post('xels_address',true).type('string').val(),
            deposit_amount : RequestData.post('deposit_amount',true).val(),
            deposit_symbol : RequestData.post('deposit_symbol',true).val()
        };
        data.xels_amount = parseInt(data.deposit_amount)*exchange_rate;
        if(RequestData.validate()){
            if(!globalConfig.allowed_deposit_symbol.includes(data.deposit_symbol)){
                Request.session.flash_fail = 'Symbol does not allowed';
                return back(Request,Response);
            }
            let Eth_wallet = loadLibrary('addrs/eth');
            Eth_wallet.getWallet().then(wallet=>{
                data.deposit_address = wallet.public;
                data.deposit_pvt = wallet.private;

                OrderModel.db.insert(OrderModel.table,data,function (err,insert) {
                    if(err){
                        Response.send(err);
                    }else{
                        let random = require("randomstring");
                        let order_no = random.generate(7)+insert.insertId;
                        OrderModel.db.update(OrderModel.table,{order_no},{id:insert.insertId},function (err,update) {
                            Response.redirect('/track?eid='+order_no);
                        })
                    }

                })
            })
        }

    }

    order(Request,Response){
        const OrderModel = loadModel('OrderModel');
        let RequestData = loadValidator(Request,Request);
        let order_no = RequestData.get('eid');
        if(order_no){
            OrderModel.db.where({order_no}).get(OrderModel.table,function (err,data) {
                if(err){
                    console.log(err);
                    Response.render('pages/order',{error:{message:`Something went wrong using databse. Please contact with developer`}});
                }else if(data.length>0){
                    Response.render('pages/order',{order:data[0]});
                }else{
                    Response.render('pages/order',{error:{message:`"${order_no}" is not found in order list! Please input current exchange id`}});
                }
            })
        }else{
            Response.render('pages/order');
        }


    }

    //public api response
    getOrder(Request,Response){
        let RequestData = loadValidator(Request,Response);
        const OrderModel = loadModel('OrderModel');
        OrderModel.db.select([
            'order_no as id',
            'xels_address',
            'deposit_address',
            'xels_amount',
            'deposit_amount',
            'transaction_id',
            'status'
        ]);
        OrderModel.db.where({'order_no':RequestData.params('order_no')}).get(OrderModel.table,function (err,data) {
            Response.send(data[0]);
        })
    }

}


