const express = require('express');
require('../system/loader');
const route = express.Router();
const auth = loadMiddleware('auth');

/*
 @write your routes blow:
 using role: route.method('route path',controller(folder/controllerName/method))
 NB: no need folder if no folder added into controllers folder.
 NB: write controllerName without Controller and .js.
*/

route.post('/new-order',controller('order/submit'));
route.get('/getOrder/:order_no',controller('order/getOrder'));
route.get('/track',controller('order/orderApi'));

/*
 //@finished all routes here
*/
module.exports = route;
