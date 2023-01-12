
let TXCuoc    = require('../../Models/TaiXiu_cuoc');
let TXCuocOne = require('../../Models/TaiXiu_one');
let TXChat = require('../../Models/TaiXiu_chat');
let TXBotChat = require('../../Models/TaiXiu_bot_chat');

let User      = require('../../Models/Users');
let UserInfo = require('../../Models/UserInfo');
let helpers   = require('../../Helpers/Helpers');
var validator   = require('validator');
var shortid   = require('shortid');
var fs 			= require('fs');

// Game User
let TaiXiu_User     = require('../../Models/TaiXiu_user');
let MiniPoker_User  = require('../../Models/miniPoker/miniPoker_users');
let Bigbabol_User   = require('../../Models/BigBabol/BigBabol_users');
let VQRed_User      = require('../../Models/VuongQuocRed/VuongQuocRed_users');
let DMAnhung_User      = require('../../Models/DongMauAnhhung/DongMauAnhhung_users');
let BauCua_User     = require('../../Models/BauCua/BauCua_user');
//let Mini3Cay_User   = require('../../Models/Mini3Cay/Mini3Cay_user');
let CaoThap_User    = require('../../Models/CaoThap/CaoThap_user');
let AngryBirds_user = require('../../Models/AngryBirds/AngryBirds_user');
let Candy_user      = require('../../Models/Candy/Candy_user');
let Sexandzen_user      = require('../../Models/Sexandzen/Sexandzen_user');
let LongLan_user    = require('../../Models/LongLan/LongLan_user');
//let ThuongHai_user    = require('../../Models/ThuongHai/ThuongHai_user');
let RoyAl_user    = require('../../Models/RoyAl/RoyAl_user');
let SieuXe_user    = require('../../Models/SieuXe/SieuXe_user');
let Zeus_user       = require('../../Models/Zeus/Zeus_user');
let Caoboi_user       = require('../../Models/Caoboi/Caoboi_user');
let XocXoc_user     = require('../../Models/XocXoc/XocXoc_user');
/**
 * Ngẫu nhiên cược
 * return {number}
*/
let random = function(){
	let a = (Math.random()*35)>>0;
	if (a == 34) {
		// 34
		return (Math.floor(Math.random()*(20-3+1))+3)*50000;
	}else if (a >= 32 && a < 34) {
		// 32 33
		return (Math.floor(Math.random()*(20-5+1))+5)*50000;
	}else if (a >= 30 && a < 32) {
		// 30 31 32
		return (Math.floor(Math.random()*(20-10+1))+10)*20000;
	}else if (a >= 26 && a < 30) {
		// 26 27 28 29
		return (Math.floor(Math.random()*(100-10+1))+10)*50000;
	}else if (a >= 21 && a < 26) {
		// 21 22 23 24 25
		return (Math.floor(Math.random()*(200-10+1))+10)*20000;
	}else if (a == 21) {
		// 15 16 17 18 19 20
		return (Math.floor(Math.random()*(10-5+1))+5)*900000;
	}else if (a >= 8 && a < 21) {
		// 8 9 10 11 12 13 14
		return (Math.floor(Math.random()*(7-2+1))+2)*400000;
	}else{
		// 0 1 2 3 4 5 6 7
		return (Math.floor(Math.random()*(100-10+1))+10)*5000;
	}
};
/**
 * Cược
*/
// Tài Xỉu RED
let tx = function(bot, io){
	let cuoc   = random();
	let select = !!((Math.random()*2)>>0);
	if (select) {
		io.taixiu.taixiu.red_tai        += cuoc;
		io.taixiu.taixiu.red_player_tai += 2;
	}else{
		io.taixiu.taixiu.red_xiu        += cuoc;
		io.taixiu.taixiu.red_player_xiu += 2;
	}
	if(cuoc > 1){
	TXCuocOne.create({uid:bot.id, phien:io.TaiXiu_phien, select:select, bet:cuoc});
	TXCuoc.create({uid:bot.id, bot: true, name:bot.name, phien:io.TaiXiu_phien, bet:cuoc, select:select, time:new Date()})};
	bot = null;
	io = null;
	cuoc   = null;
	select = null;
};
let regbot = function(){
	var username = 'nohu' + helpers.RandomUserName(5) + helpers.RandomUserName(1);
	var name = 'nohu' + helpers.RandomUserName(1) + helpers.RandomUserName(2) + helpers.RandomUserName(3);
	User.create({'local.username':username, 'local.password':helpers.generateHash(username), 'local.regDate': new Date()}, function(err, user){
		if (!!user){
			var bot_uid = user._id.toString();
			UserInfo.create({'id':bot_uid, 'name':name, 'type':true, 'joinedOn':new Date()}, function(errC, userB){
				if (!!errC) {
					console.log('reg fail name: '+ name);
				}else{
					userB = userB._doc;
					userB.level   = 1;
					userB.vipNext = 100;
					userB.vipHT   = 0;
					userB.phone   = '';

					delete userB._id;
					delete userB.redWin;
					delete userB.redLost;
					delete userB.redPlay;
					delete userB.xuWin;
					delete userB.xuLost;
					delete userB.xuPlay;
					delete userB.thuong;
					delete userB.vip;
					delete userB.hu;
					delete userB.huXu;
					
				TaiXiu_User.create({'uid': bot_uid});
												       
				MiniPoker_User.create({'uid': bot_uid});
				Bigbabol_User.create({'uid': bot_uid});
				VQRed_User.create({'uid': bot_uid});
				DMAnhung_User.create({'uid': bot_uid});
				BauCua_User.create({'uid': bot_uid});
				
				CaoThap_User.create({'uid': bot_uid});
				AngryBirds_user.create({'uid': bot_uid});
				Candy_user.create({'uid': bot_uid});
				Sexandzen_user.create({'uid': bot_uid});
				LongLan_user.create({'uid': bot_uid});
			//	ThuongHai_user.create({'uid': bot_uid});
				RoyAl_user.create({'uid': bot_uid});
				SieuXe_user.create({'uid': bot_uid});
				Zeus_user.create({'uid': bot_uid});
				Caoboi_user.create({'uid': bot_uid});
				XocXoc_user.create({'uid': bot_uid});

					TXBotChat.create({'Content': bot_uid});

					console.log('reg suss name: '+ name);

				}
			});
			console.log('reg suss acc: '+ username);
		}else{
			console.log('reg fail acc: '+ username);
		}
	});
	
};

module.exports = {
	tx: tx,
	//cl: cl,
	regbot: regbot,
}