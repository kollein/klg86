
let Poker  = require('../Controllers/game/poker/Controller');
let BaCay  = require('../Controllers/game/BaCay/Controller');
let XocXoc = require('../Controllers/game/XocXoc/init');
let BanCa  = require('../Controllers/game/BanCa/Controller');
let GiftCode = require('./autoGiftcode');

module.exports = function(io){
	io.users  = []; // danh sách người dùng đăng nhập
	io.admins = []; // danh sách admin đăng nhập

	io.game = {
		poker:    new Poker(),      // Quản lý phòng game Poker
		bacay:    new BaCay(),      // Quản lý phòng game Ba Cây
		giftcode: new GiftCode(io), // Auto phát giftcode
		xocxoc:   new XocXoc(io),   // thiết lập game Xóc Đĩa
		fish:     new BanCa(),      // thiết lập game Bắn Cá
	};
	

	// Phát sóng tới tất cả người dùng và khách
	io.broadcast = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && client.red && noBroadcast !== client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả  khách
	io.sendAllClient = function(data){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && client.red && client.auth === false) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả người dùng
	io.sendAllUser = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && client.red && client.auth === true && noBroadcast !== client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả người dùng
	io.sendAllAdmin = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (client.admin === true && client.red && client.auth === true && noBroadcast !== client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả khách
	io.sendInHome = function(data){
		io.clients.forEach(function(client){
			if (void 0 === client.admin && client.red && (client.auth === false || client.scene === 'home')) {
				client.red(data);
			}
		});
	};
};
