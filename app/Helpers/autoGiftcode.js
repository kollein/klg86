
let CronJob  = require('cron').CronJob;
let shortid  = require('shortid');
let TXChat   = require('../Models/TaiXiu_chat');
let GiftCode = require('../Models/GiftCode');
let AutoGitcode = function(io){
	this.io = io;
	this.h      = 12;    // giờ
	this.p      = 0;     // phút
	this.sl     = 10;    // số lượng
	this.gift   = 10000; // giá trị
	this.re     = 3;     // số lần lặp lại
	this.reP    = 12;    // phút (lặp lại sau)
	this.load   = 0;     // đã lặp lại

	this.status = false; // trạng thái hoạt động

	// 0 0 12 * * *
	this.cron = new CronJob('0 0 12 * * *', function() {
		this.PhatCode();
	}.bind(this), null, false, 'Asia/Ho_Chi_Minh');
}

AutoGitcode.prototype.PhatCode = function(){
	this.load = 0;
	this.SendCode();
	this.reSend();
}

AutoGitcode.prototype.SendCode = function(){
	let midCode = shortid.generate(); // mã chung
	let text = 'HỆ THỐNG tiếp tục phát Code hàng ngày cho AE,' + "\n";
	for (let i = 0; i < this.sl; i++) {
		let code = '';
		if (i === 0) {
			code = midCode;
		}else{
			code = shortid.generate();
		}
		text += code + "\n";
		let giftcode = code.toUpperCase();
		let date = new Date();
		date.setDate(date.getDate()+2);
		try {
			GiftCode.create({'code':giftcode, 'red':this.gift, 'xu':0, 'type':midCode, 'date':new Date(), 'todate':date});
		} catch (error) {}
	}
	TXChat.create({'uid':'admin', 'name':'HỆ THỐNG', 'value':text});

	let content = {taixiu:{chat:{message:{user:'HỆ THỐNG', value:text}}}};
	Object.values(this.io.users).forEach(function(users){
		users.forEach(function(member){
			member.red(content);
		});
	});
}

AutoGitcode.prototype.reSend = function(){
	if (this.re > 0 && this.load < this.re) {
		this.load++;
		setTimeout(function(){
			this.SendCode();
			this.reSend();
		}.bind(this), this.reP*60000);
	}
}

AutoGitcode.prototype.start = function(){
	this.cron.stop();

	let time = '0 '+this.p+' '+this.h+' * * *';
	this.cron = new CronJob(time, function() {
		this.PhatCode();
	}.bind(this), null, true, 'Asia/Ho_Chi_Minh');
}

AutoGitcode.prototype.stop = function(){
	this.cron.stop();
}

module.exports = AutoGitcode;
