
let get_data = require('./angrybirds/get_data');
let get_top  = require('./angrybirds/get_top');
let name_hu  = require('./angrybirds/name_hu');
let getEvent = require('./angrybirds/getEvent');
let setEvent = require('./angrybirds/setEvent');
let setChedo = require('./angrybirds/setChedo');
let reset_top  = require('./angrybirds/reset_top');
let reset_data = require('./angrybirds/reset_data');

module.exports = function(client, data) {
	if (!!data.get_data) {
		get_data(client)
	}
	if (!!data.name_hu) {
		name_hu(client, data.name_hu)
	}
	if (!!data.get_top) {
		get_top(client, data.get_top)
	}
	if (!!data.getEvent) {
		getEvent(client);
	}
	if (!!data.setEvent) {
		setEvent(client, data.setEvent);
	}
	if (void 0 !== data.chedo) {
		setChedo(client, data.chedo);
	}
	if (void 0 !== data.reset_top) {
		reset_top(client);
	}
	if (void 0 !== data.reset_data) {
		reset_data(client);
	}
}
