
let UserInfo = require('../../../../Models/UserInfo');
let get_info  = require('./get_info');

module.exports = function(client, data) {
	UserInfo.updateOne({id:data}, {'$set':{'redWin':0, 'redLost':0, 'totall':0, 'hu':0}}).exec(function(err, result){
		get_info(client, data);
	});
}
