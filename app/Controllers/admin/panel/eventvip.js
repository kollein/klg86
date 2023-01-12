
let setupEvent = require('./eventvip/setupEvent');
let update     = require('./eventvip/update');
let trathuong  = require('./eventvip/trathuong');
let getData  = require('./eventvip/getData');
let reset      = require('./eventvip/reset');

module.exports = function (client, data) {
	if (!!data.setupEvent) {
		setupEvent(client);
	}
	if (!!data.update) {
		update(client, data.update)
	}
	if (!!data.trathuong) {
		trathuong(client);
	}
	if (!!data.reset) {
		reset(client);
	}
	if (void 0 !== data.getData) {
		getData(client)
	}
}
