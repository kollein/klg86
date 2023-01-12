
let BigBabol_red = require('../../../Models/LichSu_Cuoc');

module.exports = function(client, data){
	let page = data.page>>0; // trang
	if (page < 1) {
		client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
	}else{
		let kmess = 9;
		BigBabol_red.countDocuments({'dichvu':'Candy', name: client.profile.name}).exec(function(err, total){
			BigBabol_red.find({'dichvu':'Candy',name: client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				Promise.all(result.map(function(obj){
					obj = obj._doc;
					delete obj._id;
					return obj;
				}))
				.then(resultArr => {
					client.red({mini:{big_babol:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
				})
			});
		})
	}
};
