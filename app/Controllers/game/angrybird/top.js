
var AngryBirds_red = require('../../../Models/LichSu_Cuoc');

module.exports = function(client){
	AngryBirds_red.find({'dichvu':'BUBG', type:2}, 'name win bet time type', {sort:{'_id':-1}, limit: 25}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			delete obj.__v;
			delete obj._id;
			return obj;
		}))
		.then(function(arrayOfResults) {
			client.red({mini:{arb:{top:arrayOfResults}}});
			client = null;
		});
	});
};
