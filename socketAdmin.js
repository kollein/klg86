
let validator = require('validator');
let User      = require('./app/Models/Admin');
let socket    = require('./app/Controllers/admin/socket.js');
let captcha   = require('./captcha');
let helpers   = require('./app/Helpers/Helpers');
let getConfig = require('./app/Helpers/Helpers').getConfig;
let setConfig = require('./app/Helpers/Helpers').setConfig;

// Authenticate!
let authenticate = function(client, data, callback) {
	if (!!data && !!data.username && !!data.password) {
		let username = ''+data.username+'';
		let password = ''+data.password+'';
		let captcha  = data.captcha;
		let az09     = new RegExp('^[a-zA-Z0-9]+$');
		let testName = az09.test(username);

		if (!validator.isLength(username, {min: 3, max: 32})) {
			callback({title:'ĐĂNG NHẬP', text:'Tài khoản (3-32 kí tự).'}, false);
		}else if (!validator.isLength(password, {min: 5, max: 32})) {
			callback({title:'ĐĂNG NHẬP', text:'Mật khẩu (6-32 kí tự)'}, false);
		}else if (!testName) {
			callback({title:'ĐĂNG NHẬP', text:'Tên đăng nhập chỉ gồm kí tự và số !!'}, false);
		} else {
			let configAdmin = getConfig('admin');
			if (!!configAdmin && configAdmin.anti === true) {
				callback({title:'CẢNH BÁO', text:'Bạn hoặc ai đó đang cố đăng nhập trái phép. khóa đăng nhập được kích hoạt...'}, false);	
			}else{
				try {
					username = username.toLowerCase();
					User.findOne({'username':username, 'id':1990}, function(err, user){
						if (!!user) {
							if (void 0 !== user.fail && user.fail > 3) {
								if (!captcha || !client.c_captcha) {
									client.c_captcha('signIn');
									callback({title:'ĐĂNG NHẬP', text:'Phát hiện truy cập trái phép, Tài khoản tạm khóa.'}, false);	
								}else{
									let checkCLogin = new RegExp('^' + client.captcha + '$', 'i');
									checkCLogin     = checkCLogin.test(captcha);
									if (checkCLogin) {
										if (user.validPassword(password)){
											user.fail = 0;
											user.save();
											client.UID = user._id.toString();
											callback(false, true);
										}else{
											client.c_captcha('signIn');
											user.fail += 1;
											user.save();
											callback({title:'ĐĂNG NHẬP', text:'Mật khẩu không chính xác!!'}, false);
										}
									}else{
										user.fail += 1;
										user.save();
										client.c_captcha('signIn');
										callback({title:'ĐĂNG NHẬP', text:'Captcha không đúng...'}, false);	
									}
									if (user.fail > 6) {
										configAdmin = {'anti': true};
										setConfig('admin', configAdmin);
										callback({title:'ĐĂNG NHẬP', text:'Phát hiện truy cập trái phép, Đóng đăng nhập.'}, false);	
										return void 0;
									}
								}
							}else{
								if (user.validPassword(password)){
									user.fail = 0;
									user.save();
									client.UID = user._id.toString();
									callback(false, true);
								}else{
									user.fail  = user.fail>>0;
									user.fail += 1;
									user.save();
									callback({title:'ĐĂNG NHẬP', text:'Mật khẩu không chính xác!!'}, false);
								}
							}
						}else{
							callback({title:'ĐĂNG NHẬP', text:'Tài Khoản hoặc mật khẩu không chính xác!!'}, false);
						}
					});
				} catch (error) {
					callback({title:'THÔNG BÁO', text:'Có lỗi sảy ra, vui lòng kiểm tra lại!!'}, false);
				}
			}
		}
	}
};

module.exports = function(ws, redT){
	ws.admin = true;
	ws.auth  = false;
	ws.UID   = null;
	ws.captcha   = {};
	ws.c_captcha = captcha;
	ws.red = function(data){
		try {
			this.readyState == 1 && this.send(JSON.stringify(data));
		} catch(err) {}
	}

	ws.on('message', function(message) {
		try {
			if (!!message) {
				message = JSON.parse(message);
				if (!!message.captcha) {
					this.c_captcha(message.captcha);
				}
				if (this.auth == false && !!message.authentication) {
					authenticate(this, message.authentication, function(err, success) {
						if (success) {
							ws.auth = true;
							ws.redT = redT;
							if (void 0 !== ws.redT.admins[ws.UID]) {
								ws.redT.admins[ws.UID].push(ws);
							}else{
								ws.redT.admins[ws.UID] = [ws];
							}
							socket.auth(ws);
						} else if (!!err) {
							ws.red({unauth: err});
						} else {
							ws.red({unauth: {message:'Authentication failure'}});
						}
					});
				}else if(!!this.auth){
					socket.message(this, message);
				}
			}
		} catch (error) {
		}
	});

	ws.on('close', function(message) {
		if (this.UID !== null && void 0 !== this.redT.admins[this.UID]) {
			if (this.redT.admins[this.UID].length === 1 && this.redT.admins[this.UID][0] === this) {
				delete this.redT.admins[this.UID];
				if (this.redT) {
					delete this.redT;
				}
			}else{
				var self = this;
				this.redT.admins[this.UID].forEach(function(obj, index){
					if (obj === self) {
						self.redT.admins[self.UID].splice(index, 1);
						if (self.redT) {
							delete self.redT;
						}
					}
				});
			}
		}
		this.auth = false;
	});
}
