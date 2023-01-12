
var Bank   = require('../../../Models/Bank/autoBank');

module.exports = function(client){
	Bank.find({}, function(err, list){
		if (list.length > 0) {
			list = list.map(function(obj){
				obj = obj._doc;
				delete obj._id;
				delete obj.__v;
				return obj;
			});
			client.red({shop:{CodePay:{CodePay:list}}});
		}
	});
}
