/*
 @Purpose: Global object/variables/helper function develop here
*/

const e = require('./errors');
const config = require('./config');

exports.baseUrl='';
exports.debug = config.debug;

exports.errorRes = (key=404,title='',message='') => {

    try {
        let error = e.getError(key);

        let errorResponse = {
            "status_code":key,
            "time": new Date().toString(),
            "error": {
                "title": (title.length==0)?error.title:title,
                "message": (message.length==0)?error.message:message
            }
        };
        Response.setHeader('Content-Type', 'Application/json');
        Response.status(error.header_status);
        Response.send(errorResponse);
        Response.end();
        throw 'Request error! Throw custom error['+key+']';
    }catch (e) {
        console.log('global error response method error');
    }


};

exports.successRes = (result=null) => {

    try {
        let responseData = {
            "status_code": 200,
            "time": new Date().toString(),
            "result": result
        };
        Response.setHeader('Content-Type', 'Application/json');
        Response.status(200);
        Response.send(responseData);
        Response.end();
    }catch (e) {
        console.log('global success response method error');
    }

};

exports.ucFirst  = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.lcFirst = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
exports.isInteger = (value) => {
    if(typeof value != 'number'){
        return false;
    }
    if ((undefined === value) || (null === value) || value ==='') {
        return false;
    }
    if(value===0){
        return true;
    }
    return value % 1 == 0;
};

exports.balanceToTX = (balance,currency) =>{
    currency = currency.toLowerCase();
    switch (currency) {
        case 'btc':
            balance = balance/0.00000001;
            break;
        case 'bch':
            balance = balance/0.00000001;
            break;
        case 'ltc':
            balance = balance/0.00000001;
            break;
        case 'eth':
            //return balance
            break;

        default:
            break;
    }
    return balance;
};


exports.getKeyOfMax = (obj) => {
    let max;
    for (let v in obj){
        if(max){
            if(obj[v]>obj[max]){
                max = v;
            }
        }else{
            max = v;
        }
    }
    return max;
};

exports.getChangePercent = (current,old) =>{
    return parseFloat((((current-old)/old)*100).toFixed(2));
};

exports.dbErrorRes = (e) =>{
    let customMessage = e.parent.message;

    if(e.parent.code == 'ECONNREFUSED'){
        customMessage = 'Unable to connect to the database';
        console.error('Unable to connect to the database:',e.parent.message);
    }else{
        customMessage = 'Database error occurred!';
        console.error('Database error occurred!',e.parent.message);
    }
    globalObj.errorRes(420,customMessage,e.parent.message)
};




