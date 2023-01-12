
let UserInfo = require('../../../../Models/UserInfo');
let get_users  = require('./get_users');

module.exports = function(client) {
	UserInfo.updateMany({}, {'$set':{'redWin':0, 'redLost':0, 'totall':0, 'hu':0}}).exec(function(err, result){
		get_users(client, {page: 1, sort:1});
		client = null;
	});
}
