import accounting from 'accounting'

Number.prototype.formatMoney = function (symbol = '¥', dat = 2) {
    return accounting.formatMoney(this,symbol, dat);
}