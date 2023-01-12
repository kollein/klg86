
let miniPoker_users = require('../../../../Models/miniPoker/miniPoker_users');
let get_top  = require('./get_top');

module.exports = function(client) {
	miniPoker_users.updateMany({}, {'$set':{'hu':0, 'bet':0, 'win':0, 'lost':0, 'totall':0, 'time':0, 'select':0}}).exec(function(err, result){
		get_top(client, {page: 1, sort:5});
	});
}
