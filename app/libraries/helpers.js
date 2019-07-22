exports.balanceToTx = (currency,balance) => {
    currency = currency.toLowerCase();
    let old = balance;
    switch (currency){
        case 'xels':
            balance = (balance/0.00000001).toFixed(8);
            break;
        case 'btc':
            balance = (balance/0.00000001).toFixed(8);
            break;
        default:
            break;
    }
    return parseFloat(balance);
};