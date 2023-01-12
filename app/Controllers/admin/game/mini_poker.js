
let get_data = require('./mini_poker/get_data');
let get_top  = require('./mini_poker/get_top');
let name_hu  = require('./mini_poker/name_hu');

let getEvent = require('./mini_poker/getEvent');
let setEvent = require('./mini_poker/setEvent');

let reset_top  = require('./mini_poker/reset_top');
let reset_data = require('./mini_poker/reset_data');

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
	if (void 0 !== data.get_top) {
		get_top(client, data.get_top)
	}

	if (!!data.getEvent) {
		getEvent(client)
	}
	if (!!data.setEvent) {
		setEvent(client, data.setEvent)
	}

	if (void 0 !== data.reset_top) {
		reset_top(client);
	}
	if (void 0 !== data.reset_data) {
		reset_data(client);
	}
}
