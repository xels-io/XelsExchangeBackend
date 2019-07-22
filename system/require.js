global.globalObj = require('../config/global');
global.globalConst = require('../config/constants');
global.globalConfig = require('../config/config');

path = require('path');
flash = require('express-flash');
WebRoute = require('../routes/web');
ApiRoute = require('../routes/api');

express = require('express');
app = express();
app.use(flash());

cookie = require('cookie-parser');
session = require('express-session');


app.locals.toUpperFirstAll =(str)=>{
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};