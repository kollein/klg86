
let Sexandzen_red = require('../../../Models/LichSu_Cuoc');
let UserInfo  = require('../../../Models/UserInfo');

module.exports = function(client){
	Sexandzen_red.find({dichvu:'Frozen', type:2}, 'name win bet time type', {sort:{'_id':-1}, limit: 25}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			delete obj.__v;
			delete obj._id;
			return obj;
		}))
		.then(function(arrayOfResults) {
			client.red({sexandzen:{top:arrayOfResults}});
		});
	});
};
