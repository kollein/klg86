
let spin  = require('./royal/spin');
let bonus = require('./royal/bonus');
let log   = require('./royal/log');
let top   = require('./royal/top');

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
