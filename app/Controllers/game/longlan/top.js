
var LongLan_red = require('../../../Models/LichSu_Cuoc');
var UserInfo  = require('../../../Models/UserInfo');

module.exports = function(client){
	LongLan_red.find({type:2}, 'name win bet time type', {sort:{'_id':-1}, limit: 100}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			delete obj.__v;
			delete obj._id;
			return obj;
		}))
		.then(function(arrayOfResults) {
			client.red({longlan:{top:arrayOfResults}});
		})
	});
};
