var CryptoJS = require("crypto-js");
let fs          = require('fs');
let ThongBao    = require('../Models/Title');
var LScuoc        = require('../Models/LichSu_Cuoc');
let Helpers     = require('../Helpers/Helpers');
let UserInfo    = require('../Models/UserInfo');
let TXPhien     = require('../Models/TaiXiu_phien');
let TXCuoc      = require('../Models/TaiXiu_cuoc');
let TaiXiu_User = require('../Models/TaiXiu_user');
let TXCuocOne   = require('../Models/TaiXiu_one');
let TopVip      = require('../Models/VipPoint/TopVip');
let HUTX           = require('../Models/HUTX');
let TXBotChat = require('../Models/TaiXiu_botchat');
// Hũ game
let HU_game    = require('../Models/HU');
let bot        = require('./taixiu/bot');
let botList    = [];
let botHu      = require('./bot_hu');
let botListChat    = [];
let botTemp    = [];
let io         = null;
let gameLoop   = null;
var tran = require('../Models/Transaction');
function getindex(arrray , name){
	 
	for(let i =0 ; i < arrray.length ; i++){
		if(arrray[i].name == name){
			return i+1;	
		}
	}
	return 0;
}

let botchat = function(){
 
	botChat = setInterval(function(){

			botListChat = Helpers.shuffle(botListChat);
			if(botListChat.length > 100){
				botListChat.shift();
			} 
			if(botListChat.length > 0){
				 
				TXBotChat.aggregate([
					{ $sample: { size: 1 } }
				]).exec(function(err, chatText){
					let dataBot = {};

					if(Math.floor(Math.random() * 100) < 15 && io.listTop.length > 0){
						dataBot = io.listTop[Math.floor(Math.random() * io.listTop.length)];
						if(!dataBot || dataBot.type == false){
							dataBot  =  botListChat[0];
							 
						} else{
							 
						}
					}else{
						dataBot  =  botListChat[0];
						 
					}

					chatText = Helpers.shuffle(chatText);
					if(dataBot && chatText && chatText.length > 0){
						 
						let top = getindex(io.listTop,dataBot.name);
						
						Object.values(io.users).forEach(function(users){
							users.forEach(function(client){
								var content = { taixiu: { chat: { message: { user: dataBot.name, value: chatText[0].Content, top : top } } } };
								client.red(content);
							});
						});
					}
				});
		}
		 

	},1000);

	return botChat;
}
let GetTop = function(){
	TaiXiu_User.find({'totall':{$gt:0}}, 'totall uid', {sort:{totall:-1}, limit:10}, function(err, results) {
		Promise.all(results.map(function(obj){
			return new Promise(function(resolve, reject) {
				UserInfo.findOne({'id': obj.uid}, function(error, result2){
					resolve({name:!!result2 ? result2.name : '', bet:obj.totall,type:result2.type});
				})
			})
		}))
		.then(function(result){
			io.listTop = result;
		});
	});
};
let init = function(obj){
	io = obj;

	io.listBot = [];
	io.listTop = [];

	UserInfo.find({type:true}, 'id name', function(err, list){
		if (!!list && list.length) {
			io.listBot = list.map(function(user){
				user = user._doc;
				delete user._id;
				return user;
			});
			list = null;
			
			botList = [...io.listBot];
			let maxBot = (botList.length*100/100)>>0;
			botList = Helpers.shuffle(botList); // tráo
			botList = botList.slice(0, maxBot);
			maxBot = null;
			
		}
	});

	io.taixiu = {
		taixiu: {
			red_player_tai: 0,
			red_player_xiu: 0,
			red_tai: 0,
			red_xiu: 0,
		}
	};

	io.taixiuAdmin = {
		taixiu: {
			red_player_tai: 0,
			red_player_xiu: 0,
			red_tai: 0,
			red_xiu: 0,
		},
		list: []
	};

	
	
	GetTop();
	playGame();
	botchat();
}


TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
	if (!!last){
		io.TaiXiu_phien = last.id+1;
	}
})
HUTX.findOne({}, 'phien', {sort:{'phien':-1}}, function(err, last) {
	if (!!last){
		io.TaiXiu_phiennohu = last.phien+1;
	}
})
let truChietKhau = function(bet, phe){
	return bet-Math.ceil(bet*phe/100);
}

let TopHu = function(){
	HU_game.find({}, 'game type hutx red bet toX balans x').exec(function(err, data){
		if (data.length) {
			let result = data.map(function(obj){
				obj = obj._doc;
				delete obj._id;
				return obj;
			});
			let temp_data = {TopHu:{
				mini_poker: result.filter(function(mini_poker){
					return (mini_poker.game === 'minipoker')
				}),
				big_babol: result.filter(function(big_babol){
					return (big_babol.game === 'bigbabol')
				}),
				vq_red: result.filter(function(vq_red){
					return (vq_red.game === 'vuongquocred')
				}),
				dm_anhhung: result.filter(function(dm_anhhung){
					return (dm_anhhung.game === 'dongmauanhhung')
				}),
				caothap: result.filter(function(caothap){
					return (caothap.game === 'caothap')
				}),
				arb: result.filter(function(arb){
					return (arb.game === 'arb')
				}),
				candy: result.filter(function(candy){
					return (candy.game === 'candy')
				}),
				sexandzen: result.filter(function(sexandzen){
					return (sexandzen.game === 'sexandzen')
				}),
				long: result.filter(function(long){
					return (long.game === 'long')
				}),
				roy: result.filter(function(roy){
					return (roy.game === 'roy')
				}),
				sieu: result.filter(function(sieu){
					return (sieu.game === 'sieu')
				}),
				zeus: result.filter(function(zeus){
					return (zeus.game === 'Zeus')
				}),
				caoboi: result.filter(function(caoboi){
					return (caoboi.game === 'Caoboi')
				})
			}};
			io.broadcast(temp_data);
		}
	});
}
let thongbao = function(){
	ThongBao.findOne({active:1}, 'thongbao1 thongbao2 thongbao3 hienthitb', function(err, data){
				var tb1 = data.thongbao1;
				var tb2 = data.thongbao2;
				var tb3 = data.thongbao3;
				var hienthitb = data.hienthitb;
				let home;
			home = {thongbaovn: {thongbao:hienthitb}};

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		 });
		});
}
let setTaiXiu_user = function(phien, dice){
	TXCuocOne.find({phien:phien}, {}, function(err, list) {
		if (list.length !== 0){
			Promise.all(list.map(function(obj){
				let action = new Promise((resolve, reject)=> {
					TaiXiu_User.findOne({uid:obj.uid}, function(error, data) {
						if (!!data) {
							let bet_thua = obj.bet-obj.tralai;
							let bet = obj.win ? obj.betwin+obj.bet : bet_thua;
							let update = {};
							if (bet_thua >= 10000) {
								update = {
									tLineWinRed:   obj.win && data.tLineWinRed < data.tLineWinRedH+1 ? data.tLineWinRedH+1 : data.tLineWinRed,
									tLineLostRed:  !obj.win && data.tLineLostRed < data.tLineLostRedH+1 ? data.tLineLostRedH+1 : data.tLineLostRed,
									tLineWinRedH:  obj.win ? data.tLineWinRedH+1 : 0,
									tLineLostRedH: obj.win ? 0 : data.tLineLostRedH+1,
									last:          phien,
								};
								if (obj.win) {
									if (data.tLineWinRedH == 0) {
										update.first = phien;
									}
								}else{
									if (data.tLineLostRedH == 0) {
										update.first = phien;
									}
								}
							}

							!!Object.entries(update).length && TaiXiu_User.updateOne({uid: obj.uid}, {$set:update}).exec();

							if(void 0 !== io.users[obj.uid] && (obj.win > 0)){
								io.users[obj.uid].forEach(function(client){
									client.red({taixiu:{status:{win:obj.win, select:obj.select, bet: bet}}});
								});
							}
							resolve({uid:obj.uid, betwin:obj.betwin});
						}else{
							resolve(null);
						}
					});
				});
				return action;
			}))
		     TXCuocOne.find({'phien':phien}, 'betwin uid', {sort:{betwin:-1}, limit:17}, function(err, results) {
			Promise.all(results.map(function(obj){
				let action =  new Promise(function(resolve, reject) {
					UserInfo.findOne({id:obj.uid}, 'name', function(err, users){
								resolve({users:users.name, bet:obj.betwin, game:'Tài Xỉu'});
							});
				})
				return action;
			}))
			.then(result => {
						io.sendInHome({news:{a:result}});
					});
		});
		}
	});
}

let thongtin_thanhtoan = function(game_id, dice = false){
	if (dice) {
		HU_game.findOne({game:'taixiumd5', type:1}, 'hutx', function(err, data){
		HUTX.findOne({}, 'phiennohu', {sort:{'phiennohu':-1}}, function(err, last) {
	if (!!last){
		var getphiennohu = last.phiennohu+1;
	}
	    let hutaix = data.hutx;
		let TaiXiu_red_tong_tai = 0;
		let TaiXiu_red_tong_xiu = 0;
		let TaiXiu_tonguser_tai = 0;
		let TaiXiu_tonguser_xiu = 0;
		let user_select_tai = 0;
		let user_select_xiu = 0;
		let red_player_tai = 0;
		let red_player_xiu = 0;
		let getphien = 0;

		let vipConfig = Helpers.getConfig('topVip');

		TXCuoc.find({phien:game_id}, null, {sort:{'_id':-1}}, function(err, list) {
			if(list.length){
				list.forEach(function(objL) {
					if (objL.select === true){           // Tổng Red Tài
						TaiXiu_red_tong_tai += objL.bet;
						TaiXiu_tonguser_tai += objL.phien;
						getphien = objL.phien;
					} else if (objL.select === false) {  // Tổng Red Xỉu
						TaiXiu_red_tong_xiu += objL.bet;
						TaiXiu_tonguser_xiu += objL.phien;
						getphien = objL.phien;
					}
				});
				let user_select_tai = TaiXiu_tonguser_tai/getphien;
				let user_dat_tai = user_select_tai%10;
				let user_select_xiu = TaiXiu_tonguser_xiu/getphien;
				let user_chon_xiu = user_select_xiu%10;
				let TaiXiu_tong_red_lech = Math.abs(TaiXiu_red_tong_tai - TaiXiu_red_tong_xiu);
				let TaiXiu_red_lech_tai  = TaiXiu_red_tong_tai > TaiXiu_red_tong_xiu ? true : false;
				if (TaiXiu_red_tong_tai > TaiXiu_red_tong_xiu){
					lettongtai = TaiXiu_red_tong_xiu;
				}else{
					lettongtai = TaiXiu_red_tong_tai;
				}
				TaiXiu_red_tong_tai = null;
				TaiXiu_red_tong_xiu = null;
				Promise.all(list.map(function(obj){
					let oneUpdate = {};
					let winH = false;
					let betH = 0;
					if (obj.select === true){ // Tổng Red Tài
						let win = dice > 10 ? true : false;
						if (TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
							if (TaiXiu_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_red_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win, thanhtoan:1}, $inc:{tralai:obj.bet, tienhienco:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-TaiXiu_tong_red_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = TaiXiu_tong_red_lech;
								TaiXiu_tong_red_lech = 0;
								Helpers.MissionAddCurrent(obj.uid, (betPlay*0.02>>0));

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 2);
									if(dice === 18 && (user_dat_tai === 5 || user_dat_tai === 0 )){
									hutai = betwinP*hutaix;
									addnohu = Math.ceil(hutai/lettongtai);
									//HUTX.updateMany({lenh:'1'}, {phien:'0',lenh:'0'}).exec();
									//LScuoc.create({uid:obj.uid, phien:game_id, bet:betwinP, betwin:addnohu, thanhtoan:1, tienhienco:obj.red, game:'Nổ Hũ Tài Xỉu', time:new Date()});
									HUTX.create({'name':obj.name,'uid':obj.uid,'phien':game_id,'nhan':addnohu,'quyhu':hutaix,'ketqua':dice, 'phiennohu':getphiennohu,'tongtiendat':lettongtai,'tonguser':user_select_tai,'lenh':1,time:new Date()});
								    HU_game.updateOne({game:'taixiumd5'}, {hutx:'5000000'}).exec();
									TXPhien.updateOne({phien:game_id}, {jackpot:1}).exec();
									io.sendAllUser({taixiu: {jackpot:{dices:18, jackpot:1}}});
									}else{
										addnohu = 0;
									}
									obj.betwin    = betwinP;
									let redUpdate = obj.bet+betwinP+addnohu;
									addquyhu = betwinP*0.003;
									!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:betwinP, red:redUpdate, redPlay:betPlay, redWin:betwinP}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:betwinP, tWinRed:betwinP, tRedPlay:betPlay}}).exec();
									LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win, thanhtoan:1}, $inc:{tralai:obj.tralai, lswin:betwinP, tienhienco:redUpdate}}).exec();
                                    HU_game.updateOne({game:'taixiumd5'}, {$inc:{hutx:addquyhu}}).exec();
									if (!!vipConfig && vipConfig.status === true) {
										TopVip.updateOne({'name':obj.name},{$inc:{vip:betPlay}}).exec(function(errV, userV){
											if (!!userV && userV.n === 0) {
												try{
										    		TopVip.create({'name':obj.name,'vip':betPlay});
												} catch(e){
												}
											}
										});
									}
								}else{
									!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:-betPlay, red:obj.tralai, redPlay:betPlay, redLost:betPlay}}).exec();
									LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{thanhtoan:1}, $inc:{tralai:obj.tralai, lswin:-betPlay, tienhienco:obj.tralai}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:-betPlay, tLostRed:betPlay, tRedPlay:betPlay}}).exec();
								}
								obj.save();
								//LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win, thanhtoan:1}, $inc:{tralai:obj.tralai, betwin:betwinP, tienhienco:redUpdate}}).exec();
								return TXCuocOne.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin    = truChietKhau(obj.bet, 2);
								if(dice === 18 && (user_dat_tai === 5 || user_dat_tai === 0 )){
									hutai = betwin*hutaix;
									addnohu = Math.ceil(hutai/lettongtai);
									//HUTX.updateMany({lenh:'1'}, {phien:'0',lenh:'0'}).exec();
									//LScuoc.create({uid:obj.uid, phien:game_id, bet:betwin, betwin:addnohu, thanhtoan:1, tienhienco:obj.red, game:'Nổ Hũ Tài Xỉu', time:new Date()});
									HUTX.create({'name':obj.name,'uid':obj.uid,'phien':game_id,'nhan':addnohu,'quyhu':hutaix,'ketqua':dice,'phiennohu':getphiennohu,'tongtiendat':lettongtai,'tonguser':user_select_tai,'lenh':1,time:new Date()});
									HU_game.updateOne({game:'taixiumd5'}, {hutx:'5000000'}).exec();
								    TXPhien.updateOne({phien:game_id}, {jackpot:1}).exec();
									io.sendAllUser({taixiu: {jackpot:{dices:18, jackpot:1}}});
									
									}else{
										addnohu = 0;
									}
									addquyhu = betwin*0.003;
								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();
								Helpers.MissionAddCurrent(obj.uid, (obj.bet*0.02>>0));

								if (!!vipConfig && vipConfig.status === true) {
									TopVip.updateOne({'name':obj.name},{$inc:{vip:obj.bet}}).exec(function(errV, userV){
										if (!!userV && userV.n === 0) {
											try{
									    		TopVip.create({'name':obj.name,'vip':obj.bet});
											} catch(e){
											}
										}
									});
								}

								let redUpdate = obj.bet+betwin+addnohu;
								!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:betwin, red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:betwin, tWinRed:betwin, tRedPlay: obj.bet}}).exec();
								LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:true, thanhtoan:1}, $inc:{lswin:betwin, tienhienco:redUpdate}}).exec();
								HU_game.updateOne({game:'taixiumd5'}, {$inc:{hutx:addquyhu}}).exec();
								return TXCuocOne.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();
								Helpers.MissionAddCurrent(obj.uid, (obj.bet*0.02>>0));

								!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:-obj.bet, redLost:obj.bet, redPlay:obj.bet}}).exec();
								 LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{thanhtoan:1},$inc:{lswin:-obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:-obj.bet, tLostRed:obj.bet, tRedPlay:obj.bet}}).exec();
							}
						}
					} else if (obj.select === false) { // Tổng Red Xỉu
						let win = dice > 10 ? false : true;
						if (!TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
							if (TaiXiu_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_red_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win, thanhtoan:1}, $inc:{tralai:obj.bet, tienhienco:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-TaiXiu_tong_red_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = TaiXiu_tong_red_lech;
								TaiXiu_tong_red_lech = 0;
								Helpers.MissionAddCurrent(obj.uid, (betPlay*0.02>>0));

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 2);
									if(dice === 3 && (user_chon_xiu === 5 || user_chon_xiu === 0 )){
									
									
									hutai = betwinP*hutaix;
									addnohu = Math.ceil(hutai/lettongtai);
									//HUTX.updateMany({lenh:'1'}, {phien:'0',lenh:'0'}).exec();
									HUTX.create({'name':obj.name,'uid':obj.uid,'phien':game_id,'nhan':addnohu,'quyhu':hutaix,'ketqua':dice,'phiennohu':getphiennohu,'tongtiendat':lettongtai,'tonguser':user_select_xiu,'lenh':1,time:new Date()});
								   // LScuoc.create({uid:obj.uid, phien:game_id, bet:betwinP, betwin:addnohu, thanhtoan:1, tienhienco:obj.red, game:'Nổ Hũ Tài Xỉu', time:new Date()});
									HU_game.updateOne({game:'taixiumd5'}, {hutx:'5000000'}).exec();
									io.sendAllUser({taixiu: {jackpot:{dices:3, jackpot:1}}});
									TXPhien.updateOne({phien:game_id}, {jackpot:1}).exec();
									}else{
										addnohu = 0;
									}
									addquyhu = betwinP*0.003;
									obj.betwin    = betwinP;
									let redUpdate = obj.bet+betwinP+addnohu;
									!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:betwinP, red:redUpdate, redPlay:betPlay, redWin:betwinP}}).exec();
									LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win, thanhtoan:1}, $inc:{tralai:obj.tralai, lswin:betwinP, tienhienco:redUpdate}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:betwinP, tWinRed:betwinP, tRedPlay:betPlay}}).exec();
                                    HU_game.updateOne({game:'taixiumd5'}, {$inc:{hutx:addquyhu}}).exec();
									if (!!vipConfig && vipConfig.status === true) {
										TopVip.updateOne({'name':obj.name},{$inc:{vip:betPlay}}).exec(function(errV, userV){
											if (!!userV && userV.n === 0) {
												try{
										    		TopVip.create({'name':obj.name,'vip':betPlay});
												} catch(e){
												}
											}
										});
									}
								}else{
									!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:-betPlay, red:obj.tralai, redPlay: betPlay, redLost:betPlay}}).exec();
									LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{thanhtoan:1}, $inc:{lswin:-betPlay, tralai:obj.tralai, tienhienco:obj.tralai}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:-betPlay, tLostRed:betPlay, tRedPlay:betPlay}}).exec();
								}
								obj.save();
								return TXCuocOne.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin    = truChietKhau(obj.bet, 2);
								if(dice === 3 && (user_chon_xiu === 5 || user_chon_xiu === 0 )){
									
									
									hutai = betwin*hutaix;
									addnohu = Math.ceil(hutai/lettongtai);
									//HUTX.updateMany({lenh:'1'}, {phien:'0',lenh:'0'}).exec();
									//LScuoc.create({uid:obj.uid, phien:game_id, bet:betwin, betwin:addnohu, thanhtoan:1, tienhienco:obj.red, game:'Nổ Hũ Tài Xỉu', time:new Date()});
									HUTX.create({'name':obj.name,'uid':obj.uid,'phien':game_id,'nhan':addnohu,'quyhu':hutaix,'ketqua':dice,'phiennohu':getphiennohu,'tongtiendat':lettongtai,'tonguser':user_select_xiu,'lenh':1,time:new Date()});
									HU_game.updateOne({game:'taixiumd5'}, {hutx:'5000000'}).exec();
									TXPhien.updateOne({phien:game_id}, {jackpot:1}).exec();
									io.sendAllUser({taixiu: {jackpot:{dices:3, jackpot:1}}});
									}else{
										addnohu = 0;
									}
								addquyhu = betwin*0.003;	
								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();
								Helpers.MissionAddCurrent(obj.uid, (obj.bet*0.02>>0));

								if (!!vipConfig && vipConfig.status === true) {
									TopVip.updateOne({'name':obj.name},{$inc:{vip:obj.bet}}).exec(function(errV, userV){
										if (!!userV && userV.n === 0) {
											try{
									    		TopVip.create({'name':obj.name,'vip':obj.bet});
											} catch(e){
											}
										}
									});
								}

								let redUpdate = obj.bet+betwin+addnohu;
								!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:betwin, red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{totall:betwin, tWinRed:betwin, tRedPlay: obj.bet}}).exec();
								 LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:true, thanhtoan:1}, $inc:{lswin:betwin, tienhienco:redUpdate}}).exec();
								 HU_game.updateOne({game:'taixiumd5'}, {$inc:{hutx:addquyhu}}).exec();
								return TXCuocOne.updateOne({uid:obj.uid, phien:game_id}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
							}else{
								Helpers.MissionAddCurrent(obj.uid, (obj.bet*0.02>>0));
								obj.thanhtoan = true;
								obj.save();

								!obj.bot && UserInfo.updateOne({id:obj.uid}, {$inc:{totall:-obj.bet, redLost:obj.bet, redPlay:obj.bet}}).exec();
								LScuoc.updateOne({uid:obj.uid, phien:game_id}, {$set:{thanhtoan:1}, $inc:{lswin:-obj.bet}}).exec();
								TaiXiu_User.updateOne({uid:obj.uid}, {$inc:{totall:-obj.bet, tLostRed:obj.bet, tRedPlay:obj.bet}}).exec();
							}
						}
					}
					return 1;
				}))
				.then(function(resultUpdate) {
					playGame();
					setTaiXiu_user(game_id, dice);
					//get_newtop(game_id, dice);
					TaiXiu_tong_red_lech = null;
					TaiXiu_red_lech_tai  = null;
					vipConfig = null;
				});
			}else if (dice) {
				playGame();
				vipConfig = null;
			}
		});
	});	
	});	
	}else{
		// Users
		let home = {taixiu:{taixiu:{red_tai: io.taixiu.taixiu.red_tai, red_xiu: io.taixiu.taixiu.red_xiu}}};

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red({taixiu: io.taixiu});
				}else if(client.scene == 'home'){
					client.red(home);
				}
				client = null;
			});
			users = null;

		});

		// Admin
		Object.values(io.admins).forEach(function(admin){
			admin.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red({taixiu: io.taixiuAdmin});
				}
				client = null;
			});
			admin = null;
		});

		// Khách
		if (!(io.TaiXiu_time%10)) {
			io.sendAllClient(home);
		}
	}
}
let playGame = function(){

	
	//io.TaiXiu_time = 77;
	io.TaiXiu_time = 72;
	gameLoop = setInterval(function(){
		
		if (!(io.TaiXiu_time%5)) {
			TopHu();
			thongbao();
	
			HU_game.findOne({game:'taixiumd5', type:1}, 'hutx', function(err, datahu){
				var tienhu = datahu.hutx;
				let home;
				home = {hutxmain: {monney:tienhu}};
		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		 });
		});
	
		}
		HU_game.findOne({game:'taixiumd5', type:1}, 'hutx', function(err, datahu){
				var tienhu = datahu.hutx;
				let home;
			home = {taixiu: {hutx:{monney:tienhu}}};
           // home = {hutxmain: {monney:tienhu}};
		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		 });
		});
		
		if (io.TaiXiu_time == 64) {

			// Users
			let home;
			home = {taixiu: {finish3:{phien:199}}};

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		});
		}
		if (io.TaiXiu_time == 60) {
       ThongBao.findOne({active:1}, 'thongbao1 thongbao2 thongbao3 hienthitb', function(err, data){
		   if(!!data){
			   var thongbao1 = data.thongbao1;
			    ThongBao.updateOne({hienthitb:thongbao1}).exec();
		   }
		  
	   })
			// Users
			let home;
			home = {taixiu:{err: 'Bắt đầu phiên mới.'}};

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		});
		}
		//bot.regbot();
		io.TaiXiu_time--;
		// console.log(io.TaiXiu_time);
		if (io.TaiXiu_time <= 60) {
				if (io.TaiXiu_time == 20) {
       ThongBao.findOne({active:1}, 'thongbao1 thongbao2 thongbao3 hienthitb', function(err, data){
		   if(!!data){
			   var thongbao2 = data.thongbao2;
			    ThongBao.updateOne({hienthitb:thongbao2}).exec();
		   }
		  
	  });
		}if (io.TaiXiu_time == 1) {
       ThongBao.findOne({active:1}, 'thongbao1 thongbao2 thongbao3 hienthitb', function(err, data){
		   if(!!data){
			   var thongbao2 = 'club333 Cổng game xanh chín uy tín, Rút tiền nhanh 24/7';
			    ThongBao.updateOne({hienthitb:thongbao2}).exec();
		   }
		  
	  });
		}
			if (io.TaiXiu_time == 5) {
			// Users
			let home;
			if (io.taixiu.taixiu.red_tai > io.taixiu.taixiu.red_xiu) {
				io.taixiu.taixiu.red_tai = io.taixiu.taixiu.red_xiu;
				home = {taixiu:{taixiu:{red_tai: io.taixiu.taixiu.red_tai, red_xiu: io.taixiu.taixiu.red_xiu},err: 'Trả tiền cân cửa.'}};
			}else{
				io.taixiu.taixiu.red_xiu = io.taixiu.taixiu.red_tai;
				home = {taixiu:{taixiu:{red_tai: io.taixiu.taixiu.red_tai, red_xiu: io.taixiu.taixiu.red_xiu},err: 'Trả tiền cân cửa.'}};
			}

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		});
		}
		
		if (io.TaiXiu_time == -1) {

			// Users
			let home;
			home = {taixiu: {finish2:{phien:1990}}};

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red(home);
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		});
		}
		
			if (io.TaiXiu_time < 0) {
				clearInterval(gameLoop);
				io.TaiXiu_time = 0;
					let taixiujs = Helpers.getData('taixiumd5');
				if (!!taixiujs) {
					let dice1 = parseInt(taixiujs.dice1 == 0 ? Math.floor(Math.random() * 6) + 1 : taixiujs.dice1);
					let dice2 = parseInt(taixiujs.dice2 == 0 ? Math.floor(Math.random() * 6) + 1 : taixiujs.dice2);
					let dice3 = parseInt(taixiujs.dice3 == 0 ? Math.floor(Math.random() * 6) + 1 : taixiujs.dice3);

					taixiujs.dice1  = 0;
					taixiujs.dice2  = 0;
					taixiujs.dice3  = 0;
					taixiujs.uid    = '';
					taixiujs.rights = 2;

					Helpers.setData('taixiumd5', taixiujs);

					TXPhien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()}, function(err, create){
						if (!!create) {
							io.TaiXiu_phien = create.id+1;
							thongtin_thanhtoan(create.id, dice1+dice2+dice3);
							io.sendAllUser({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}});

							Object.values(io.admins).forEach(function(admin){
								admin.forEach(function(client){
									client.red({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}});
									client = null;
								});
								admin = null;
							});
							dice1 = null;
							dice2 = null;
							dice3 = null;
						}
					});
				}
				io.taixiu = {
					taixiu: {
						red_player_tai: 0,
						red_player_xiu: 0,
						red_tai: 0,
						red_xiu: 0,
					}
				};
				io.taixiuAdmin = {
					taixiu: {
						red_player_tai: 0,
						red_player_xiu: 0,
						red_tai: 0,
						red_xiu: 0,
					},
					list: []
				};
				GetTop();
				let taixiucf = Helpers.getConfig('taixiu');
				if (!!taixiucf && taixiucf.bot && !!io.listBot && io.listBot.length > 0) {
					// lấy danh sách tài khoản bot
					botTemp = [...io.listBot];
					botList = [...io.listBot];
					let maxBot = (botList.length*100/100)>>0;
					botList = Helpers.shuffle(botList); // tráo
					botList = botList.slice(0, maxBot);
					botListChat = botTemp;
					maxBot = null;
				}else{
					botTemp = [];
					botList = [];
					botListChat = [];
				}
			}else{
				thongtin_thanhtoan(io.TaiXiu_phien);
				if (!!botList.length && io.TaiXiu_time > 5) {
					let userCuoc = 0;
					if (!((Math.random()*3)>>0)) {
						userCuoc = (Math.random()*65)>>0;
					}else{
						userCuoc = (Math.random()*29)>>0;
					}
					let iH = 0;
					for (iH = 0; iH < userCuoc; iH++) {
						let dataT = botList[iH];
						if (!!dataT) {
							bot.tx(dataT, io);
							botList.splice(iH, 1); // Xoá bot đã đặt tránh trùng lặp
						}
						dataT = null;
					}
				}
			}
			
			
		}
		botHu(io, botTemp);
	}, 1000);
	return gameLoop;
}

module.exports = init;
