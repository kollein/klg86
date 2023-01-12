
// OTP
var OTP              = require('../../../../Models/OTP');

// Nạp Thẻ
var NapThe           = require('../../../../Models/NapThe');

// Mua Thẻ
var MuaThe           = require('../../../../Models/MuaThe');
var MuaThe_card      = require('../../../../Models/MuaThe_card');

// Bank
var Bank_history     = require('../../../../Models/Bank/Bank_history');

// Chuyển Red
//var ChuyenRed          = require('../../../../Models/ChuyenRed');

var Message          = require('../../../../Models/Message');

// Gift Code
var GiftCode         = require('../../../../Models/GiftCode');

// Tài Xỉu
var TaiXiu_phien     = require('../../../../Models/TaiXiu_phien');
var TaiXiu_one       = require('../../../../Models/TaiXiu_one');
var TaiXiu_cuoc      = require('../../../../Models/TaiXiu_cuoc');
var TaiXiu_chat      = require('../../../../Models/TaiXiu_chat');

// AngryBirds
var AngryBirds_red   = require('../../../../Models/AngryBirds/AngryBirds_red');

// BauCua
var BauCua_phien     = require('../../../../Models/BauCua/BauCua_phien');
var BauCua_cuoc      = require('../../../../Models/BauCua/BauCua_cuoc');

// BigBabol
var BigBabol_red     = require('../../../../Models/BigBabol/BigBabol_red');

// CaoThap
var CaoThap_red      = require('../../../../Models/CaoThap/CaoThap_red');
var CaoThap_redbuoc  = require('../../../../Models/CaoThap/CaoThap_redbuoc');

// Mini3Cay
var Mini3Cay_red     = require('../../../../Models/Mini3Cay/Mini3Cay_red');

// miniPoker
var miniPokerRed     = require('../../../../Models/miniPoker/miniPokerRed');

// VuongQuocRed
var VuongQuocRed_red = require('../../../../Models/VuongQuocRed/VuongQuocRed_red');

// Candy
var Candy_red        = require('../../../../Models/Candy/Candy_red');

// LongLan
var LongLan_red      = require('../../../../Models/LongLan/LongLan_red');

module.exports = function() {
	// OTP
	var time7   = new Date()-604800000;   // 7 Ngày
	var otpTime = new Date()-180000;      // 3 phút

	OTP.deleteMany({$or:[{'active':true}, {'date':{$lt: otpTime}}]}).exec();

	NapThe.deleteMany({'time':{$lt:time7}, 'status':{$gt:0}}).exec();

	MuaThe.find({'time':{$lt:time7}, 'status':{$gt:0}}, '_id', function(err, data){
		Promise.all(data.map(function(card){
			var idCart = card._id.toString();
			MuaThe_card.deleteMany({'cart':idCart}).exec();
			card.remove();
		}));
	});

	Bank_history.deleteMany({'time':{$lt:time7}, 'status':{$gt:0}}).exec();

	// GiftCode
	var GiftCodeTime = new Date();     // GiftCode hết hạn
	GiftCode.deleteMany({'todate':{$lt: GiftCodeTime}}).exec();

	// Xóa mọi tin nhắn
	Message.deleteMany({}).exec();

	// Tài Xỉu
	TaiXiu_phien.findOne({}, 'id', {sort:{'_id': -1}}, function(err, data){
		if (!!data && data.id > 200) {
			var phien = data.id-200;
			TaiXiu_phien.deleteMany({'id':{$lt: phien}}).exec();
			TaiXiu_one.deleteMany({'phien':{$lt: phien}}).exec();
			TaiXiu_cuoc.deleteMany({'phien':{$lt: phien}}).exec();
		}
	});
	TaiXiu_chat.deleteMany({}).exec();

	// AngryBirds
	var timeDay = new Date()-86400000;
	AngryBirds_red.deleteMany({'time':{$lt: timeDay}}).exec();

	// Bầu Cua
	BauCua_phien.findOne({}, 'id', {sort:{'_id': -1}}, function(err, data){
		if (!!data && data.id > 200) {
			var phien = data.id-200;
			BauCua_phien.deleteMany({'id':{$lt: phien}}).exec();
			BauCua_cuoc.deleteMany({'phien':{$lt: phien}}).exec();
		}
	});

	// BigBabol
	BigBabol_red.deleteMany({'time':{$lt: timeDay}}).exec();

	// Cao Thấp Red
	CaoThap_red.findOne({}, 'id', {sort:{'_id': -1}}, function(err, data){
		if (!!data && data.id > 200) {
			var phien = data.id-200;
			CaoThap_red.deleteMany({'id':{$lt: phien}}).exec();
			CaoThap_redbuoc.deleteMany({'id':{$lt: phien}}).exec();
		}
	});

	// Mini3Cay
	Mini3Cay_red.deleteMany({'time':{$lt: timeDay}}).exec();

	// miniPoker
	miniPokerRed.deleteMany({'time':{$lt: timeDay}}).exec();

	// VuongQuocRed
	VuongQuocRed_red.deleteMany({'time':{$lt: timeDay}}).exec();

	// Candy
	Candy_red.deleteMany({'time':{$lt: timeDay}}).exec();

	// LongLan
	LongLan_red.deleteMany({'time':{$lt: timeDay}}).exec();
}
