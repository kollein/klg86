var tabDaiLy   = require('../../Models/DaiLy');
module.exports = function(client){
	tabDaiLy.find({rights: 11}, function(err, daily){
		client.red({shop:{daily:daily}});
	});
}
