
let BauCua_user = require('../../../../Models/BauCua/BauCua_user');
let UserInfo    = require('../../../../Models/UserInfo');

module.exports = function(client, data) {
		if (!!data && !!data.page && !!data.sort) {
		let page  = data.page>>0;
		let kmess = 10;
		if (page > 0) {
			let sort = {};
			if (data.sort == '1') {
				sort.win = 1;
			}else if (data.sort == '2') {
				sort.win = -1;

			}else if (data.sort == '3') {
				sort.lost = -1;
			}else if (data.sort == '4') {
				sort.lost = 1;

			}else if (data.sort == '5') {
				sort.totall = -1;
			}else if (data.sort == '6') {
				sort.totall = 1;

			}else{
				sort.totall = -1;
			}
			BauCua_user.countDocuments({}).exec(function(err, total){
				BauCua_user.find({}, 'win lost totall uid', {sort:sort, skip:(page-1)*kmess, limit:kmess}, function(err, results) {
					if (results.length) {
						Promise.all(results.map(function(obj){
							return new Promise(function(resolve, reject) {
								obj = obj._doc;
								UserInfo.findOne({'id': obj.uid}, function(error, result2){
									delete obj._id;
									delete obj.uid;
									obj.name = !!result2 ? result2.name : '';
									result2 = null;
									resolve(obj);
								})
							})
						}))
						.then(function(data){
							client.red({baucua:{dashboard:{data:data, page:page, kmess:kmess, total:total}}});
						});
					}else{
						client.red({baucua:{dashboard:{data:[], page:1, kmess:10, total:0}}});
					}
				});
			});
		}
	}
}
