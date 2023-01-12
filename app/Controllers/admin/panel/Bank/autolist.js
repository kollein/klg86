
var Bank = require('../../../../Models/Bank/autoBank');

module.exports = function (client, notice = false) {
	Bank.find({}, {}, function(err, data){
		if (notice) {
			client.red({autoBank:{data:data},notice:{title:notice.title,text:notice.text}});
		}else{
			client.red({autoBank:{data:data}});
		}
	});
}
