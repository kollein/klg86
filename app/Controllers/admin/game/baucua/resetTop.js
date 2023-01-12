
let BauCua_user = require('../../../../Models/BauCua/BauCua_user');
let dashboard   = require('./dashboard');

module.exports = function(client) {
	BauCua_user.updateMany({}, {'$set':{'win':0, 'lost':0, 'totall':0, 'bet':0}}).exec(function(err, result){
		dashboard(client, {page:1, sort:5});
		client = null;
	});
}
