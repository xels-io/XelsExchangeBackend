/*
 @Purpose: All errors response data
*/

let errors = [];

errors[404] = {
    header_status:404,
    title:'404 Not Found',
    message : 'The page/data you requested was not found'
};

errors[401] = {
    header_status:401,
    title:'Authentication failure',
    message : "E-email/Password didn't match"
};

errors[403] = {
    header_status:403,
    title:'Access denied',
    message : "Authentication required"
};


errors[420] = {
    header_status:500,
    title:'Database Error occurred',
    message : 'Database Error occurred!'
};
errors[422] = {
    header_status:404,
    title:'Data Not Found',
    message : 'You requested for data was not found'
};

errors[100] = {
    header_status:400,
    title:'Field is empty',
    message : 'Field is required'
};
errors[102] = {
    header_status:401,
    title:'type value is required',
    message : 'type value is required'
};
errors[103] = {
    header_status:401,
    title:'Minimum value is required',
    message : 'Minimum value is required'
};
errors[104] = {
    header_status:401,
    title:'Maximum value is required',
    message : 'Maximum value is required'
};
errors[120] = {
    header_status:401,
    title:'does not allow input value',
    message : 'does not allow input value'
};

errors[123] = {
    header_status:401,
    title:'Invalid Address',
    message : 'Your Provided address is invalid'
};
errors[500] = {
    header_status:500,
    title:'Internal Server Error',
    message : 'Internal Server Error'
};

errors[512] = {
    header_status:500,
    title:'Method is not defined',
    message : 'Method is not defined'
};

errors[520] = {
    header_status:500,
    title:'Method is not defined',
    message : 'Method is not defined'
};

errors[524] = {
    header_status:520,
    title:'Unknown Error occurred',
    message : 'Unknown error! Please contact with api developer'
};

errors[522] = {
    header_status:500,
    title:'Duplicate Entry',
    message : 'Duplicate entry not allow'
};


errors[428] = {
    header_status:500,
    title:'Currency not exist',
    message : 'Your requested currency not exist'
};
errors[435] = {
    header_status:500,
    title:'Pair not available',
    message : 'You exchange request is currently unavailable'
};

errors[612] = {
    header_status:400,
    title:'Payment confirmation pending',
    message : 'Payment did not send or did not confirm yet'
};

errors[540] = {
    header_status:500,
    title:'Transaction failure',
    message : 'Sending amount of currency is failure'
};
errors[545] = {
    header_status:500,
    title:'Request failure',
    message : 'You requested was not complete successfully'
};
errors[533] = {
    header_status:500,
    title:'Response error of api calling',
    message : 'Error response of api calling'
};

errors[600] = {
    header_status:500,
    title:'Something went wrong!',
    message : 'The server may not recognize your request/data'
};





exports.getError = (key) => {
    return errors[key];
};