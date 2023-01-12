
var BigBabol_red = require('../../../Models/LichSu_Cuoc');

module.exports = function(client){
	BigBabol_red.find({'dichvu':'Candy', type:2}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			delete obj.__v;
			delete obj._id;
			return obj;
		}))
		.then(function(arrayOfResults) {
			client.red({mini:{big_babol:{top:arrayOfResults}}});
		})
	});
};
