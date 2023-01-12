
var DongMauAnhhung_red = require('../../../Models/LichSu_Cuoc');
module.exports = function(client, data){
	if (!!data && !!data.page) {
		var page = data.page>>0; // trang
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			var kmess = 10;
			DongMauAnhhung_red.countDocuments({dichvu:'Dòng Máu Anh Hùng', name:client.profile.name}).exec(function(err, total){
				DongMauAnhhung_red.find({dichvu:'Dòng Máu Anh Hùng', name:client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({DongMauAnhhung:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
					})
				});
			});
		}
	}
};
