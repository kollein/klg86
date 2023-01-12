var addauto   = require('./addauto');
var autolist  = require('./autolist');
var add       = require('./add');
var remove    = require('./remove');
var removeauto    = require('./removeauto');
var list      = require('./list');
var rut       = require('./rut');
var updateRut = require('./updateRut');
var updateNap = require('./updateNap');

var nap       = require('./nap');
var napAdd    = require('./napAdd');
var napRemove = require('./napRemove');

module.exports = function (client, data) {
	if (!!data.list) {
		list(client);
	}
	if (!!data.add) {
		add(client, data.add);
	}
	if (!!data.addauto) {
		addauto(client, data.addauto);
	}
	if (!!data.autolist) {
		autolist(client, data.autolist);
	}
	if (!!data.remove) {
		remove(client, data.remove);
	}
	if (!!data.removeauto) {
		removeauto(client, data.removeauto);
	}
	if (!!data.rut) {
		rut(client, data.rut);
	}
	if (!!data.updateRut) {
		updateRut(client, data.updateRut);
	}
	if (!!data.updateNap) {
		updateNap(client, data.updateNap);
	}
	if (!!data.nap) {
		nap(client, data.nap);
	}
	if (!!data.napAdd) {
		napAdd(client, data.napAdd);
	}
	if (!!data.napremove) {
		napRemove(client, data.napremove);
	}
}
