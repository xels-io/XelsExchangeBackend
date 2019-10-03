/*
 @Purpose: Application configuration
*/


env = require('../env');

exports.app_name = (env.app_name)?env.app_name:'NodeJs Project';


/*
 @Current project status set here for development/production/testing
*/

exports.environment = (env.environment)?env.environment:'development';



/*
 @login token any session expired after this time period
*/
exports.session_expired = 1*60*1000*60*12;//1 day


/*
 @Application print error and debugging data in console
*/
exports.debug = (env.debug)?env.debug:true;

/*
 @Is application use https
*/
exports.https = (env.https)?env.https:false;

/*
 @Application run in this port at http
*/
exports.httpPort = (env.httpPort)?env.httpPort:80;

/*
 @Application run in this port at https
*/
exports.httpsPort = (env.httpsPort)?env.httpsPort:443;


/*
 @Application use socket io
*/
exports.socket = (env.socket)?env.socket:false;


/*
 @JWT web token build by this secret
*/

exports.jwt_secret = (env.jwt_secret)?env.jwt_secret:'My-New-Secret';

exports.cryptoNetwork = (env.cryptoNetwork)?env.cryptoNetwork:'mainnet';