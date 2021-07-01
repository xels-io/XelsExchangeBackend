const Controller = loadCore('controller');
let $this;
let UserModel = loadModel('UserModel')

module.exports = class homeController extends Controller {

    constructor() {
        super();
        $this = this;
    }



    submit(Request,Response){

        let isApiRequest = Request.originalUrl.includes('/api/');
        
        const OrderModel = loadModel('OrderModel');
        let RequestData = loadValidator(Request,Response);
        let data = {
            xels_address : RequestData.post('xels_address',true).type('string').pattern(/[Xx]{1}[a-km-zA-HJ-NP-Z1-9]{26}/).val(),
            deposit_amount : RequestData.post('deposit_amount',true).val(),
            deposit_symbol : RequestData.post('deposit_symbol',true).val()
        };

        if(isApiRequest){
            var user_code = RequestData.post('user_code',true).type('string').val()
        }
        data.xels_amount = parseInt(data.deposit_amount)*exchange_rate;
        if(RequestData.validate()){
            if(!globalConfig.allowed_deposit_symbol.includes(data.deposit_symbol)){
                if(isApiRequest){
                    Response.status(500).send({error:1,err_code:'NOT_FOUND',message:'Symbol does not allowed'});
                    return; 
                }
                Request.session.flash_fail = 'Symbol does not allowed';
                return back(Request,Response);
            }
            let Eth_wallet = loadLibrary('addrs/eth');
            Eth_wallet.getWallet().then(async wallet=>{
                data.deposit_address = wallet.public;
                data.deposit_pvt = wallet.private;

                if(isApiRequest){
                    let user = await UserModel.findOrCreate({user_code})
                    data.user_id = user.id;
                }

                OrderModel.db.insert(OrderModel.table,data,function (err,insert) {
                    if(err){
                        console.log(err)
                        return Response.status(500).send({error:1,err_code:'SERVER_ERROR',message:'Something went wrong using databse. Please contact with developer!'}); 
                    }else{
                        let random = require("randomstring");
                        let order_no = random.generate(7)+insert.insertId;
                        OrderModel.db.update(OrderModel.table,{order_no},{id:insert.insertId},async function (err,update) {

                            if(Request.originalUrl.includes('/api/')){
                                let order = await OrderModel.getOrder(order_no);
                                Response.send(order[0])
                            }else{
                                Response.redirect('/track?eid='+order_no);
                            }
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
    //same as order(Request,Response)
    orderApi(Request,Response){

        const OrderModel = loadModel('OrderModel');
        let RequestData = loadValidator(Request,Request);
        let order_no = RequestData.get('eid');
        OrderModel.getOrder(order_no).then(data=>{
            if(data.length>0){
                Response.send(data[0])
            }else{
                Response.status(500).send({error:1,err_code:'NOT_FOUND',message:`${order_no} is not found in order list! Please input current exchange id`}); 
            }
        }).catch(err=>{
            console.log(err)
            return Response.status(500).send({error:1,err_code:'SERVER_ERROR',message:'Something went wrong using databse. Please contact with developer!'}); 
        })
    }

    //public api response
    getOrder(Request,Response){
        let order_no = Request.params['order_no'];
        const OrderModel = loadModel('OrderModel');
        OrderModel.getOrder(order_no).then(data=>{
            if(data.length>0){
                Response.send(data[0]);
            }else{
                Response.send({})
            }
            
        }).catch(err=>{
            return Response.status(500).send({error:1,err_code:'SERVER_ERROR',message:'Something went wrong using databse. Please contact with developer!'});
        })
        
    }

    //public api response
    getOrders(Request,Response){
        let RequestData = loadValidator(Request,Response);
        let user_code = RequestData.post('user_code',true,'User Code').val();
        if(RequestData.validate()){
            UserModel.db.where(`user_code = '${user_code}'`).get(UserModel.table,(err,users)=>{
                if(err){
                    return Response.status(500).send({error:1,err_code:'SERVER_ERROR',message:'Something went wrong using databse. Please contact with developer!'});
                }else if(users.length>0){
                    const OrderModel = loadModel('OrderModel');
                    OrderModel.getOrders(users[0].id).then(data=>{
                        Response.send(data);
                    }).catch(err=>{
                        return Response.status(500).send({error:1,err_code:'SERVER_ERROR',message:'Something went wrong using databse. Please contact with developer!'});
                    })
                }else{
                    Response.send([]);
                }
            })
        }
        
    }

}


