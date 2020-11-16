const Model = loadCore('model');
module.exports = class OrderModel extends Model{
    constructor(){
        super();
        this.table = 'orders';
        this.primaryKey='id';
        this.selectArray = [
            'order_no as id',
            'xels_address',
            'deposit_address',
            'deposit_symbol',
            'xels_amount',
            'deposit_amount',
            'transaction_id',
            'status'
        ];
    }
    getOrder(order_no){
        return new Promise((resolve,reject)=>{
            this.db.select(this.selectArray);
            this.db.where({order_no}).get(this.table,function (err,data) {
                if(err) reject(err)
                else resolve(data)
            })
        })
    }

    getOrders(user_id){
        return new Promise((resolve,reject)=>{
            this.db.select(this.selectArray);
            this.db.where({user_id}).get(this.table,function (err,data) {
                if(err) reject(err)
                else resolve(data)
            })
        })
    }
};