
var Zeus_red = require('../../../Models/LichSu_Cuoc');
var UserInfo  = require('../../../Models/UserInfo');

module.exports = function(client, data){
		Zeus_red.find({dichvu:'Liên Minh Huyền Thoại', type:{$gte:2}}, 'name win bet time type', {sort:{'_id':-1}, limit: 25}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({Zeus:{top:arrayOfResults}});
			})
		});
};
