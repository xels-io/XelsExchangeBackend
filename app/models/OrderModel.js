const Model = loadCore('model');
module.exports = class OrderModel extends Model{
    constructor(){
        super();
        this.table = 'orders';
        this.primaryKey='id';
    }
};