require('../system/loader');
const express = require('express');
const route = express.Router();
const multer = require('multer');
const upload = multer({dest: './assets/uploads/'});
const auth = loadMiddleware('auth');

/*
 @write your routes blow:
*/
route.get('/',controller('home/index'));
route.post('/order-submit',controller('order/submit'));
route.get('/track',controller('order/order'));
/*
 @//finished your all routes here
*/
module.exports = route;


