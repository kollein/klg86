
module.exports = function(client) {
	var data = require('../../../../../config/topVip.json');
	client.red({eventvip:{setupData:data}});
}
