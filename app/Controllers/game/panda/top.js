
let Candy_red = require('../../../Models/Candy/Candy_red');
let UserInfo  = require('../../../Models/UserInfo');

module.exports = function(client){
	Candy_red.find({type:2}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			delete obj.__v;
			delete obj._id;
			return obj;
		}))
		.then(function(arrayOfResults) {
			client.red({candy:{top:arrayOfResults}});
		});
	});
};
