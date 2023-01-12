
var SieuXe_red = require('../../../Models/LichSu_Cuoc');
var SieuXe_xu  = require('../../../Models/SieuXe/SieuXe_xu');

var UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		SieuXe_red.find({dichvu:'Đua Xe', type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 25}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({sieuxe:{top:arrayOfResults}});
			})
		});
	}else{
		SieuXe_xu.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({sieuxe:{top:arrayOfResults}});
			})
		});
	}
};
