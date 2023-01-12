
let Mini3Cay_red = require('../../../Models/Mini3Cay/Mini3Cay_red');
module.exports = function(client, data){
	if (!!data && !!data.page) {
		let page = data.page>>0; // trang
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			let kmess = 8;
			Mini3Cay_red.countDocuments({uid: client.UID}).exec(function(err, total){
				Mini3Cay_red.find({uid: client.UID}, 'id bet win kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					if (result.length) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj.__v;
							delete obj._id;
							return obj;
						}))
						.then(function(arrayOfResults) {
							client.red({mini:{bacay:{logs:{data:arrayOfResults, page:page, kmess:kmess, total:total}}}});
						})
					}else{
						client.red({mini:{bacay:{logs:{data:[], page:page, kmess:kmess, total:0}}}});
					}
				});
			});
		}
	}
};
