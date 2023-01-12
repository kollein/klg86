
let CaoThap_red = require('../../../Models/CaoThap/CaoThap_red');
let UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client){
	CaoThap_red.find({play: false, goc:50000}, 'uid goc bet a time', {sort:{'_id':-1}, limit: 50}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			obj.a = (obj.a.length == 3);
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
			client.red({mini:{caothap:{tops:arrayOfResults}}});
		})
	});
};
