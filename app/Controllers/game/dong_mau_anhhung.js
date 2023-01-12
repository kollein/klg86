
let spin  = require('./dong_mau_anhhung/spin');
let bonus = require('./dong_mau_anhhung/bonus');
let log   = require('./dong_mau_anhhung/log');
let top   = require('./dong_mau_anhhung/top');

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
