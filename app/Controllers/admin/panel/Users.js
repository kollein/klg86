
let get_users     = require('./user/get_users');
let get_naprut    = require('./user/get_naprut');
let get_info      = require('./user/get_info');
let updateUser    = require('./user/updateUser');
let remove        = require('./user/remove');
let history       = require('./user/history');
let resetvip      = require('./user/resetvip');
let resettk       = require('./user/resettk');
let user_resetvip = require('./user/user_resetvip');
let user_resettk  = require('./user/user_resettk');
let reset_data    = require('./user/reset_data');
let getblanceall = require('./user/blanceall');

module.exports = function (client, data) {
	if (void 0 !== data.get_info) {
		get_info(client, data.get_info);
	}
	if (void 0 !== data.get_users) {
		get_users(client, data.get_users);
	}
	if (void 0 !== data.get_naprut) {
		get_naprut(client, data.get_naprut);
	}
	if (void 0 !== data.update) {
		updateUser(client, data.update);
	}
	if (!!data.remove) {
		remove(client, data.remove);
	}
	if (!!data.getblanceall) {
		getblanceall(client, data.getblanceall);
	}
	if (!!data.history) {
		history(client, data.history);
	}
	if (!!data.resetvip) {
		resetvip(client, data.resetvip);
	}
	if (!!data.resettk) {
		resettk(client, data.resettk);
	}
	if (!!data.user_resetvip) {
		user_resetvip(client, data.user_resetvip);
	}
	if (!!data.user_resettk) {
		user_resettk(client, data.user_resettk);
	}
	if (!!data.reset_data) {
		reset_data(client, data.reset_data);
	}
	
}
