const moment = require('moment');

module.exports = (req,res,next) => {
    if (!req.session.user) {
        if(req.xhr){
            res.send({
                'error':1,
                'err_code':'AUTH_FAILURE',
                'msg':'Authentication Failure'
            })
        }
        res.redirect('/login');
    } else {
        next();
    }
};