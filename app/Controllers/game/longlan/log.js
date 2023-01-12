
let LongLan_red = require('../../../Models/LichSu_Cuoc');
module.exports = function(client, data){
	if (!!data && !!data.page) {
		let page = data.page>>0; // trang
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			let kmess = 8;
			LongLan_red.countDocuments({name: client.profile.name}).exec(function(err, total){
				LongLan_red.find({name: client.profile.name}, 'id win bet line time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({longlan:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
					});
				});
			});
		}
	}
};
