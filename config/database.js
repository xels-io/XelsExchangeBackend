/*
 @Purpose: Database setting information
*/

const env = require('../env');

/*
 @Purpose: use driver name like mysql or false without database
*/

exports.dbdriver = 'mysql';
exports.host = (env.host)?env.host:'localhost';
exports.database = (env.database_name)?env.database_name:'';
exports.user = (env.database_user)?env.database_user:'';
exports.password = (env.database_password)?env.database_password:'';
exports.debug = false;