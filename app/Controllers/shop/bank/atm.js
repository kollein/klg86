
let list   = require('./atm/list');
let select = require('./atm/select');

module.exports = function(client, data){
	if (!!data.list) {
		list(client);
	}
	if (!!data.select) {
		select(client, data.select);
	}
}
