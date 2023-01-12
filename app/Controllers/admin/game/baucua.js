
let BauCua_setDice = require('./baucua/set_dice');
let BauCua_getNew  = require('./baucua/get_new');
let dashboard      = require('./baucua/dashboard');
let resetTop       = require('./baucua/resetTop');

module.exports = function(client, data) {
	if (void 0 !== data.view) {
		client.gameEvent.viewBauCua = !!data.view
	}
	if (void 0 !== data.get_new) {
		BauCua_getNew(client);
	}
	if (void 0 !== data.set_dice) {
		BauCua_setDice(client, data.set_dice);
	}
	if (!!data.dashboard) {
		dashboard(client, data.dashboard);
	}
	if (!!data.resetTop) {
		resetTop(client);
	}
}
