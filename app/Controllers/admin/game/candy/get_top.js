
let Candy_user = require('../../../../Models/Candy/Candy_user');
let UserInfo   = require('../../../../Models/UserInfo');

module.exports = function(client, data) {
	if (!!data && !!data.page && !!data.sort) {
		var page = data.page>>0;
		var kmess = 9;

		if (page > 0) {

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

			Candy_user.countDocuments({}).exec(function(err, total){
				Candy_user.find({}, 'bet win lost uid totall time select', {sort:sort, skip:(page-1)*kmess, limit:kmess}, function(err, results) {
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
							client.red({candy:{get_top:{data:data, page:page, kmess:kmess, total:total}}});
						});
					}else{
						client.red({candy:{get_top:{data:[], page:1, kmess:9, total:0}}});
					}
				});
			});

/**
			// sort
			var sort = {};
			if (data.sort == '1') {
				sort.bet = -1;
			}else if (data.sort == '2') {
				sort.bet = 1;


			}else if (data.sort == '3') {
				sort.win = -1;
			}else if (data.sort == '4') {
				sort.win = 1;


			}else if (data.sort == '5') {
				sort.lost = -1;
			}else if (data.sort == '6') {
				sort.lost = 1;


			}else if (data.sort == '7') {
				sort.profit = -1;
			}else if (data.sort == '8') {
				sort.profit = 1;


			}else if (data.sort == '9') {
				sort.time = -1;
			}else if (data.sort == '10') {
				sort.time = 1;


			}else{
				sort.profit = -1;
			}

			// count total
			Candy_user.aggregate([
				{$count: 'total'},
			]).exec(function(err, countFind){
				Candy_user.aggregate([
					{$project: {
						profit: {$subtract: ['$win', '$lost']},
						uid:    '$uid',
						bet:    '$bet',
						win:    '$win',
						lost:   '$lost',
						time:   '$time',
					}},
					{$sort: sort},
					{$skip: (page-1)*kmess},
					{$limit: kmess}
				]).exec(function(err, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							return new Promise(function(resolve, reject) {
								UserInfo.findOne({'id': obj.uid}, 'name', function(error, user){
									delete obj._id;
									delete obj.uid;
									if (!!user) {
										obj['name'] = user.name;
										Candy_red.findOne({'name': user.name}, 'bet time', {sort:{'_id': -1}}, function(error, result2){
											if (!!result2) {
												obj['t'] = result2.time;
												obj['b'] = result2.bet;
											}
											resolve(obj);
										})
									}else{
										resolve(obj);
									}
								})
							})
						}))
						.then(function(data){
							client.red({candy:{get_top:{data:data, page:page, kmess:kmess, total:countFind[0].total}}});
						})
					}else{
						client.red({candy:{get_top:{data:[], page:1, kmess:9, total:0}}});
					}
				});
			});

			*/
		}
	}
}
