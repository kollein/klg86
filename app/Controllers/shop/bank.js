
let list = require('./bank/list');
let rut  = require('./bank/rut');
let nap  = require('./bank/nap');
let CodePay = require('./bank/CodePay');

module.exports = function(client, data){
	if (!!data.list) {
		list(client);
	}
	if (!!data.CodePay) {
		CodePay(client);
	}
	if (!!data.rut) {
		rut(client, data.rut);
	}
	if (!!data.nap) {
		nap(client, data.nap);
	}
}
