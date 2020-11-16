const Model = loadCore('model');
module.exports = class UserModel extends Model{
    constructor(){
        super();
        this.table = 'users';
        this.primaryKey='id';
    }

    findOrCreate(cond){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.db.where(`user_code = '${cond.user_code}'`).get(_this.table,(err,res)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }else if(res.length>0){
                    resolve(res[0])
                }else{
                    _this.db.query(`INSERT INTO ${_this.table} (user_code) VALUES ('${cond.user_code}')`,(err,res)=>{
                        if(err){
                            console.log(err)
                            reject(err)
                        }else{
                            resolve({
                                id:res.insertId,
                                ...cond
                            })
                        }
                    })
                }
            })
        })
    }
};