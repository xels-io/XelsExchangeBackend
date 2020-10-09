let allowed_keys = ['1234567890','xels-exchange-allowed-api'];
module.exports = (req,res,next) => {
    let authorization_key = req.header('Authorization');
    if (!authorization_key || !allowed_keys.includes(authorization_key)) {
        res.send({
            'error':1,
            'err_code':'AUTH_FAILURE',
            'msg':'API Authentication Failure'
        })
    } else {
        next();
    }
};