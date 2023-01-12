
let LongLan_user = require('../../../../Models/LongLan/LongLan_user');
let get_top  = require('./get_top');

module.exports = function(client) {
	LongLan_user.updateMany({}, {'$set':{'hu':0, 'bet':0, 'win':0, 'lost':0, 'totall':0, 'time':0, 'select':0}}).exec(function(err, result){
		get_top(client, {page: 1, sort:5});
	});
}
