
let TX_User  = require('../../../../Models/TaiXiu_user');
let UserInfo = require('../../../../Models/UserInfo');

function viewDashboard(client){
	var waitTX_Win = new Promise((a, b) => { // Top 50 Dây thắng tài xỉu hiện tại
		TX_User.find({}, 'uid tLineWinRed tLineWinRedH', {sort:{'tLineWinRedH': -1}, limit: 50}, function(err, data){
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getUser]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				a(arrayOfResults);
			})
		});
	});
	var waitTX_Lost = new Promise((a, b) => { // Top 50 Dây Thua tài xỉu hiện tại
		TX_User.find({}, 'uid tLineLostRed tLineLostRedH', {sort:{'tLineLostRedH': -1}, limit: 50}, function(err, data){
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getUser]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				a(arrayOfResults);
			})
		});
	});
	Promise.all([waitTX_Win, waitTX_Lost])
	.then(values => {
		client.red({taixiu:{dashboard:{dTXWin: values[0], dTXLost: values[1]}}});
	});
}

function get_top(client, data){
	if (!!data && !!data.page && !!data.sort) {
		let red   = !!data.red;
		let page  = data.page>>0;
		let kmess = 10;

		if (page > 0) {
			let project = {};
				project.uid      = '$uid';
			if (red) { // Red
				project.profitTX = {$subtract: ['$tWinRed', '$tLostRed']};
				project.tWin     = '$tWinRed';
				project.tLost    = '$tLostRed';
			}
			let sort = {};
			if (data.sort == '1') {
				sort.tWinRed = 1;
			}else if (data.sort == '2') {
				sort.tWinRed = -1;

			}else if (data.sort == '3') {
				sort.tLostRed = -1;
			}else if (data.sort == '4') {
				sort.tLostRed = 1;

			}else if (data.sort == '5') {
				sort.totall = -1;
			}else if (data.sort == '6') {
				sort.totall = 1;

			}else{
				sort.totall = -1;
			}
			TX_User.aggregate([
				{$count: 'total'},
			]).exec(function(err, countFind){
				TX_User.aggregate([
					{$project: project},
					{$sort: sort},
					{$skip: (page-1)*kmess},
					{$limit: kmess}
				]).exec(function(err, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							return new Promise(function(resolve, reject) {
								UserInfo.findOne({'id': obj.uid}, function(error, result2){
									delete obj._id;
									delete obj.uid;
									obj['name'] = result2.name;
									resolve(obj);
								})
							})
						}))
						.then(function(data){
							client.red({taixiu:{dashboard:{get_users:{data:data, page:page, kmess:kmess, total:countFind[0].total}}}});
						})
					}else{
						client.red({taixiu:{dashboard:{get_users:{data:[], page:1, kmess:10, total:0}}}});
					}
				});
			});
		}
	}
}
let resetTop = function(client){
	TX_User.updateMany({}, {'$set':{'tWinRed':0, 'tLostRed':0, 'totall':0, 'tRedPlay':0}}).exec(function(err, result){
		get_top(client, {page: 1, sort:5});
		client = null;
	});
}
let resetDay = function(client){
	TX_User.updateMany({}, {'$set':{'tLineWinRed':0, 'tLineWinRedH':0, 'tLineLostRed':0, 'tLineLostRedH':0}}).exec(function(err, result){
		viewDashboard(client);
		client = null;
	});
}
module.exports = function(client, data) {
	if (void 0 !== data.view) {
		viewDashboard(client);
	}
	if (void 0 !== data.get_top) {
		get_top(client, data.get_top);
	}
	if (void 0 !== data.resetTop) {
		resetTop(client);
	}
	if (void 0 !== data.resetDay) {
		resetDay(client);
	}
}
