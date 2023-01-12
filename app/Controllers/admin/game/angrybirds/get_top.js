
let AngryBirds_user = require('../../../../Models/AngryBirds/AngryBirds_user');
let AngryBirds_red  = require('../../../../Models/LichSu_Cuoc');
let UserInfo        = require('../../../../Models/UserInfo');

module.exports = function(client, data) {
	if (!!data && !!data.page && !!data.sort) {
		let page = data.page>>0;
		let kmess = 9;
		if (page > 0) {
			// sort
			let sort = {};
			if (data.sort == '1') {
				sort.bet = 1;
			}else if (data.sort == '2') {
				sort.bet = -1;

			}else if (data.sort == '3') {
				sort.win = -1;
			}else if (data.sort == '4') {
				sort.win = 1;

			}else if (data.sort == '5') {
				sort.lost = -1;
			}else if (data.sort == '6') {
				sort.lost = 1;

			}else if (data.sort == '7') {
				sort.totall = -1;
			}else if (data.sort == '8') {
				sort.totall = 1;

			}else if (data.sort == '9') {
				sort.time = -1;
			}else if (data.sort == '10') {
				sort.time = 1;

			}else{
				sort.totall = -1;
			}

			AngryBirds_user.countDocuments({}).exec(function(err, total){
				AngryBirds_user.find({}, 'bet win lost uid totall time select', {sort:sort, skip:(page-1)*kmess, limit:kmess}, function(err, results) {
					if (results.length) {
						Promise.all(results.map(function(obj){
							return new Promise(function(resolve, reject) {
								obj = obj._doc;
								UserInfo.findOne({'id':obj.uid}, 'name', function(error, user){
									delete obj._id;
									delete obj.uid;
									if (!!user) {
										obj['name'] = user.name;
										if (obj.time > 0) {
											let time = new Date();
											time.setTime(obj.time);
											obj.time = time;
										}
									}
									resolve(obj);
								})
							})
						}))
						.then(function(data){
							client.red({angrybird:{get_top:{data:data, page:page, kmess:kmess, total:total}}});
						});
					}else{
						client.red({angrybird:{get_top:{data:[], page:1, kmess:9, total:0}}});
					}
				});
			});
		}
	}
}
