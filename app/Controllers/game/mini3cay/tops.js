
let Mini3Cay_red = require('../../../Models/Mini3Cay/Mini3Cay_red');
let UserInfo     = require('../../../Models/UserInfo');
module.exports = function(client){
	Mini3Cay_red.find({type:{$gte:4}}, 'uid bet win kq time', {sort:{'_id':-1}, limit: 50}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			var getPhien = UserInfo.findOne({id: obj.uid}, 'name').exec();
			return Promise.all([getPhien]).then(values => {
				Object.assign(obj, values[0]._doc);
				delete obj.__v;
				delete obj._id;
				delete obj.uid;
				return obj;
			});
		}))
		.then(function(arrayOfResults) {
			client.red({mini:{bacay:{tops:arrayOfResults}}});
		})
	});
};
