
let spin  = require('./sieuxe/spin');
let bonus = require('./sieuxe/bonus');
let log   = require('./sieuxe/log');
let top   = require('./sieuxe/top');

module.exports = function(client, data){
	if (!!data.bonus) {
		bonus(client, data.bonus)
	}
	if (!!data.spin) {
		spin(client, data.spin)
	}
	if (!!data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
};
