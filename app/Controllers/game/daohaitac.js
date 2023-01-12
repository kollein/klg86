
let spin  = require('./daohaitac/spin');
let bonus = require('./daohaitac/bonus');
let log   = require('./daohaitac/log');
let top   = require('./daohaitac/top');

module.exports = function(client, data){
	if (!!data.bonus) {
		bonus(client, data.bonus);
	}
	if (!!data.spin) {
		spin(client, data.spin);
	}
	if (!!data.log) {
		log(client, data.log);
	}
	if (void 0 !== data.top) {
		top(client);
	}
};
