const moment = require('moment');

module.exports = (req,res,next) => {
    if (!req.session.user) {
        if(req.xhr){
            res.send({
                'status':false,
                'msg':'Login required'
            })
        }
        res.redirect('/login');
    } else {
        next();
    }
};