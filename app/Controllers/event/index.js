
let taixiu = require('./taixiu/index');
let vipp   = require('./vipp/vipp');

module.exports = function(client, data){
	if (!!data.taixiu) {
		taixiu(client, data.taixiu);
	}
	if (!!data.vipp) {
		vipp(client, data.vipp);
	}
};
