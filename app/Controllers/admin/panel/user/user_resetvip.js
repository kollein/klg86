
let UserInfo = require('../../../../Models/UserInfo');
let get_info  = require('./get_info');

module.exports = function(client, data) {
	UserInfo.updateOne({id:data}, {'$set':{'redPlay':0, 'vip':0, 'lastVip':0}}).exec(function(err, result){
		get_info(client, data);
	});
}
