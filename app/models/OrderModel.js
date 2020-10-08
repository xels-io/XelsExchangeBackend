const Model = loadCore('model');
module.exports = class OrderModel extends Model{
    constructor(){
        super();
        this.table = 'orders';
        this.primaryKey='id';
    }
    getOrder(order_no){
        return new Promise((resolve,reject)=>{
            this.db.select([
                'order_no as id',
                'xels_address',
                'deposit_address',
                'xels_amount',
                'deposit_amount',
                'transaction_id',
                'status'
            ]);
            this.db.where({order_no}).get(this.table,function (err,data) {
                if(err) reject(err)
                else resolve(data)
            })
        })
    }
};