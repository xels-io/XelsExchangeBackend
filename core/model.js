require('../system/loader');
const db = require('../config/database');
const mysql = require('mysql');
const queryBuilder = require('node-querybuilder').QueryBuilder({
    host: host=db.host,
    database: db.database,
    user: db.user,
    password: db.password,
    debug:db.debug
}, 'mysql', 'single');



class Model {

    constructor(){
        this.db = queryBuilder;
        this.table='';
        this.primaryKey = 'id';
        this.select = '*';
    };

    paginate(config){
        return new Promise((resolve,reject)=>{
            let model = new Model();
            model.found_rows().then(total=>{

            })
        })
    }
    found_rows(){
        return new Promise((resolve,reject)=>{
            this.db.query('SELECT FOUND_ROWS() as count',(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    let count = (result[0].count)?result[0].count:0;
                    resolve(count);
                }
            });
        });
    }

}

module.exports = Model;