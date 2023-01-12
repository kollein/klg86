
let Bank_history = require('../app/Models/Bank/Bank_history');
let Helper       = require('../app/Helpers/Helpers');

module.exports = function(res, data) {
	if (!!data.mrc_order_id) {
		Bank_history.findOne({'_id':data.mrc_order_id}, 'money', function(err, history){
			if (!!history && data.stat === 'c') {
				res.render('bank/success', {nap:Helper.numberWithCommas(history.money)});
				data = null;
				res = null;
			}else{
				res.render('bank/err');
				data = null;
				res = null;
			}
		});
	}else{
		res.render('bank/default');
		data = null;
		res = null;
	}
}
