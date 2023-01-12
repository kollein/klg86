
let XocXoc_user = require('../../../../Models/XocXoc/XocXoc_user');
let dashboard   = require('./dashboard');

module.exports = function(client) {
	XocXoc_user.updateMany({}, {'$set':{'win':0, 'lost':0, 'totall':0, 'bet':0}}).exec(function(err, result){
		dashboard(client, {page:1, sort:5});
		client = null;
	});
}
