
let HU = require('../../../../Models/HU');
let get_data = require('./get_data');

module.exports = function(client) {
	HU.updateMany({game:'long'}, {'$set':{'name':'', 'redWin':0, 'redPlay':0, 'redLost':0, 'hu':0}}).exec(function(err, result){
		get_data(client);
	});
}
