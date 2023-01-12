
let path         = require('path');
let fs           = require('fs');
let Helpers      = require('../Helpers/Helpers');
let UserInfo     = require('../Models/UserInfo');
let BauCua_phien = require('../Models/BauCua/BauCua_phien');
let BauCua_cuoc  = require('../Models/LichSu_Cuoc');
let BauCua_user  = require('../Models/BauCua/BauCua_user');
let BauCua_temp  = require('../Models/BauCua/BauCua_temp');
var LScuoc        = require('../Models/LichSu_Cuoc');
let bot        = require('./baucua/bot');
let botList    = [];
let io       = null;
let gameLoop = null;

let init = function init(obj){
	io = obj;
	io.BauCua_phien = 1;
	io.baucua = {ingame:[]};
	io.baucua.info = {
		redBau:0,
		redCa:0,
		redCua:0,
		redGa:0,
		redHuou:0,
		redTom:0,
	};

	io.baucua.infoAdmin = {
		redBau:0,
		redCa:0,
		redCua:0,
		redGa:0,
		redHuou:0,
		redTom:0,
	};

	BauCua_phien.findOne({}, 'id', {sort:{'_id':-1}}, function(err, last) {
		if (!!last){
			io.BauCua_phien = last.id+1;
		}
		playGame();
	});
}

let thongtin_thanhtoan = function thongtin_thanhtoan(dice = null){
	if (!!dice) {
		let heSo   = {}; // Hệ số nhân
		for (let i = 0; i < 3; i++) {
			let dataT = dice[i];
			if (void 0 === heSo[dataT]) {
				heSo[dataT] = 1;
			}else{
				heSo[dataT] += 1;
			}
		}
		let updateLog = {};
		for (let j = 0; j < 6; j++) {
			if (void 0 !== heSo[j]) {
				updateLog[j] = heSo[j];
			}
		}
		let phien = io.BauCua_phien-1;
		BauCua_temp.updateOne({}, {$inc:updateLog}).exec();
		BauCua_cuoc.find({phien:phien, dichvu:'Bầu Cua'}, {}, function(err, list) {
			if (list.length) {
				Promise.all(list.map(function(cuoc){
					let TongThua  = 0; // Số tiền thua
					let TongThang = 0; // Tổng tiền thắng (đã tính gốc)
					let thuong    = 0;
					let huou      = 0;
					let bau       = 0;
					let ga        = 0;
					let ca        = 0;
					let cua       = 0;
					let tom       = 0;
					let totall    = 0;

					// Cược Hươu
					if (cuoc[0] > 0) {
						if (void 0 !== heSo[0]) {
							huou = (cuoc[0]*heSo[0]);
							totall    += huou;
							TongThang += cuoc[0]+huou*0.98;
						}else{
							totall    -= cuoc[0];
						}
					}
					// Cược Bầu
					if (cuoc[1] > 0) {
						if (void 0 !== heSo[1]) {
							bau = (cuoc[1]*heSo[1]);
							totall    += bau;
							TongThang += cuoc[1]+bau*0.98;
						}else{
							totall    -= cuoc[1];
						}
					}
					// Cược Gà
					if (cuoc[2] > 0) {
						if (void 0 !== heSo[2]) {
							ga = (cuoc[2]*heSo[2]);
							totall    += ga;
							TongThang += cuoc[2]+ga*0.98;
						}else{
							totall    -= cuoc[2];
						}
					}
					// Cược Cá
					if (cuoc[3] > 0) {
						if (void 0 !== heSo[3]) {
							ca = (cuoc[3]*heSo[3]);
							totall    += ca;
							TongThang += cuoc[3]+ca*0.98;
						}else{
							totall    -= cuoc[3];
						}
					}
					// Cược Cua
					if (cuoc[4] > 0) {
						if (void 0 !== heSo[4]) {
							cua = (cuoc[4]*heSo[4]);
							totall    += cua;
							TongThang += cuoc[4]+cua*0.98;
						}else{
							totall    -= cuoc[4];
						}
					}
					// Cược Tôm
					if (cuoc[5] > 0) {
						if (void 0 !== heSo[5]) {
							tom = (cuoc[5]*heSo[5]);
							totall    += tom;
							TongThang += cuoc[5]+tom*0.98;
						}else{
							totall    -= cuoc[5];
						}
					}

					let tongDat    = cuoc[0]+cuoc[1]+cuoc[2]+cuoc[3]+cuoc[4]+cuoc[5];
					let update     = {};
					let updateGame = {};
					cuoc.thanhtoan = 1;
					cuoc.betwin    = TongThang;
					tongwin = TongThang-tongDat;
					cuoc.save();
					update['totall']     = totall;
					updateGame['totall'] = totall;					
					if (TongThang > 0) {
						update['red'] = TongThang;
						//LScuoc.updateOne({uid:cuoc.uid, phien:phien}, {$set:{betwin:tongwin}, $inc:{tienhienco:cuoc.betwin}}).exec();
					}
					if (totall > 0) {
						update['redWin'] = updateGame['win'] = totall;
					}
					if (totall < 0) {
						update['redLost'] = updateGame['lost'] = totall*-1;
					}
					update['redPlay'] = updateGame['bet'] = tongDat;
					BauCua_cuoc.updateOne({uid:cuoc.uid, dichvu:'Bầu Cua', phien:phien}, {$set:{lswin:tongwin}, $inc:{tienhienco:cuoc.betwin}}).exec();
					BauCua_user.updateOne({uid:cuoc.uid, dichvu:'Bầu Cua'}, {$inc:updateGame}).exec();
					!cuoc.bot && (UserInfo.updateOne({id:cuoc.uid}, {$inc:update}).exec());

					if(void 0 !== io.users[cuoc.uid]){
						let status = {};
						if (TongThang > 0) {
							status = {mini:{baucua:{status:{win:true, bet:TongThang}}}};
						}else{
							status = {mini:{baucua:{status:{win:false, bet:Math.abs(totall)}}}};
						}
						io.users[cuoc.uid].forEach(function(client){
							client.red(status);
						});
						status = null;
					}
					TongThang  = null;
					huou       = null;
					bau        = null;
					ga         = null;
					ca         = null;
					cua        = null;
					tom        = null;
					tongDat    = null;
					update     = null;
					updateGame = null;
					return {users:cuoc.name, bet:totall};
				}))
				.then(function(arrayOfResults) {
					heSo  = null;
					phien = null;
					dice = null;
					arrayOfResults = arrayOfResults.filter(function(st){
						return st.bet > 10000;
					});
					if (arrayOfResults.length) {
						arrayOfResults.sort(function(a, b){
							return b.bet-a.bet;
						});

						arrayOfResults = arrayOfResults.slice(0, 10);
						arrayOfResults = Helpers.shuffle(arrayOfResults);

						Promise.all(arrayOfResults.map(function(obj){
							return {users:obj.users, bet:obj.bet, game:'Bầu Cua'};
						}))
						.then(results => {
							io.sendInHome({news:{a:results}});
							results = null;
						});
					}
					playGame();
				});
			}else{
				heSo  = null;
				phien = null;
				dice = null;
				playGame();
			}
		});
	}else{
		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewBauCua !== void 0 && client.gameEvent.viewBauCua){
					client.red({mini:{baucua:{data:io.baucua.info}}});
				}
			});
		});

		let admin_data = {baucua:{info:io.baucua.infoAdmin, ingame:io.baucua.ingame}};
		Object.values(io.admins).forEach(function(admin){
			admin.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewBauCua !== void 0 && client.gameEvent.viewBauCua){
					client.red(admin_data);
				}
			});
		});
	}
}

let playGame = function(){
	io.BauCua_time = 71;
	//io.BauCua_time = 15;

	gameLoop = setInterval(function(){
		io.BauCua_time--;
		if (io.BauCua_time <= 60) {
			if (io.BauCua_time < 0) {
				clearInterval(gameLoop);
				io.BauCua_time = 0;
				let bcjs = Helpers.getData('baucua');
				if (!!bcjs) {
					let dice1 = bcjs[0] == 6 ? (Math.random()*6)>>0 :bcjs[0];
					let dice2 = bcjs[1] == 6 ? (Math.random()*6)>>0 :bcjs[1];
					let dice3 = bcjs[2] == 6 ? (Math.random()*6)>>0 :bcjs[2];

					bcjs[0]     = 6;
					bcjs[1]     = 6;
					bcjs[2]     = 6;
					bcjs.uid    = '';
					bcjs.rights = 2;

					Helpers.setData('baucua', bcjs);

					BauCua_phien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()}, function(err, create){
						if (!!create) {
							io.BauCua_phien = create.id+1;
							thongtin_thanhtoan([dice1, dice2, dice3]);
							io.sendAllUser({mini:{baucua:{finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}}});

							Object.values(io.admins).forEach(function(admin){
								admin.forEach(function(client){
									client.red({baucua:{finish:true, dices:[create.dice1, create.dice2, create.dice3]}});
								});
							});
						}
					});
				}
				io.baucua.ingame = [];
				io.baucua.info = {
					redBau:0,
					redCa:0,
					redCua:0,
					redGa:0,
					redHuou:0,
					redTom:0,
				};
				io.baucua.infoAdmin = {
					redBau:0,
					redCa:0,
					redCua:0,
					redGa:0,
					redHuou:0,
					redTom:0,
				};
				let bccf = Helpers.getConfig('baucua');
				if (!!bccf && bccf.bot && !!io.listBot && io.listBot.length > 0) {
					// lấy danh sách tài khoản bot
					botList = [...io.listBot];
					let maxBot = (botList.length*50/100)>>0;
					botList = Helpers.shuffle(botList);
					botList = botList.slice(0, maxBot);
				}else{
					botList = [];
				}
			}else{
				thongtin_thanhtoan();
				if (!!botList.length && io.BauCua_time > 2) {
					let userCuoc = (Math.random()*15)>>0;
					for (let i = 0; i < userCuoc; i++) {
						let dataT = botList[i];
						if (!!dataT) {
							bot(dataT, io);
							botList.splice(i, 1); // Xoá bot đã đặt tránh trùng lặp
						}
						dataT = null;
					}
				}
			}
		}
	}, 1000);
	return gameLoop;
}

module.exports = init;
