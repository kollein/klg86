
let users = require('./socketUsers');
let admin = require('./socketAdmin');
// Router Websocket

module.exports = function(app, redT) {
	app.ws('/client', function(ws, req) {
		users(ws, redT);
	});
	app.ws('/vn1102', function(ws, req) {
		admin(ws, redT)
	});
};
