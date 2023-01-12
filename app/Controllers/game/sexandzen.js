
let spin  = require('./sexandzen/spin');
let bonus = require('./sexandzen/bonus');
let log   = require('./sexandzen/log');
let top   = require('./sexandzen/top');

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
