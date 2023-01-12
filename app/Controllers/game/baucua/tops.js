
let BauCua_user = require('../../../Models/BauCua/BauCua_user');
let UserInfo    = require('../../../Models/UserInfo');
module.exports = function(client){
	BauCua_user.find({'totall':{$gt:0}}, 'totall uid', {sort:{totall:-1}, limit:100}, function(err, results) {
		Promise.all(results.map(function(obj){
			return new Promise(function(resolve, reject) {
				UserInfo.findOne({'id': obj.uid}, function(error, result2){
					resolve({name:!!result2 ? result2.name : '', bet:obj.totall});
				});
			});
		}))
		.then(function(data){
			client.red({mini:{baucua:{tops:data}}});
			data = null;
			client = null;
		});
	});
};
