

var RoyAl_red = require('../../../Models/LichSu_Cuoc');
var RoyAl_xu  = require('../../../Models/RoyAl/RoyAl_xu');

module.exports = function(client, data){
	if (!!data && !!data.page) {
		var page = data.page>>0; // trang
		var red  = !!data.red;   // Loại tiền (Red: true, Xu: false)
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			var kmess = 10;
			if (red) {
				RoyAl_red.countDocuments({dichvu:'Royal', name:client.profile.name}).exec(function(err, total){
					RoyAl_red.find({dichvu:'Royal', name:client.profile.name}, 'id win bet line time kq', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({royal:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
						})
					});
				})
			}else{
				RoyAl_xu.countDocuments({name:client.profile.name}).exec(function(err, total){
					RoyAl_xu.find({name:client.profile.name}, 'id win bet line time kq', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({royal:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
						})
					});
				})
			}
		}
	}
};
