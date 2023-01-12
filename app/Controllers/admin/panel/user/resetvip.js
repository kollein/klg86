
let UserInfo = require('../../../../Models/UserInfo');
let get_users  = require('./get_users');

module.exports = function(client) {
	UserInfo.updateMany({}, {'$set':{'redPlay':0, 'vip':0, 'lastVip':0}}).exec(function(err, result){
		get_users(client, {page: 1, sort:1});
		client = null;
	});
}
