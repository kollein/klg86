let spin  = require('./Caoboi/spin');
let bonus = require('./Caoboi/bonus');
let log   = require('./Caoboi/log');
let top   = require('./Caoboi/top');

module.exports = function(client, data){
	if (!!data.bonus) {
		bonus(client, data.bonus)
	}
	if (!!data.spin) {
		console.log(data.spin);
		spin(client, data.spin)
	}
	if (!!data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client)
	}
};