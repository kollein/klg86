let spin  = require('./Zeus/spin');
let bonus = require('./Zeus/bonus');
let log   = require('./Zeus/log');
let top   = require('./Zeus/top');

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