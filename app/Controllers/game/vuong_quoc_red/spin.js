
let HU                 = require('../../../Models/HU');
let VuongQuocRed_red   = require('../../../Models/LichSu_Cuoc');
let VuongQuocRed_users = require('../../../Models/VuongQuocRed/VuongQuocRed_users');
let TopVip    = require('../../../Models/VipPoint/TopVip');
let UserInfo  = require('../../../Models/UserInfo');
var LScuoc        = require('../../../Models/LichSu_Cuoc');
let Helpers   = require('../../../Helpers/Helpers');

function random_cel3(){
	return (Math.random()*7)>>0;
}

function random_cel2(){
	let a = (Math.random()*28)>>0;
	if (a == 27) {
		// 27
		return 6;
	}else if (a >= 25 && a < 27) {
		// 25 26
		return 5;
	}else if (a >= 22 && a < 25) {
		// 22 23 24
		return 4;
	}else if (a >= 18 && a < 22) {
		// 18 19 20 21
		return 3;
	}else if (a >= 13 && a < 18) {
		// 13 14 15 16 17
		return 2;
	}else if (a >= 7 && a < 13) {
		// 7 8 9 10 11 12
		return 1;
	}else{
		// 0 1 2 3 4 5 6   
		return 0;
	}
}

function random_cel11(){
	return (Math.random()*5)>>0;
}
function random_cel1(){
	let a = (Math.random()*15)>>0;
	if (a == 14) {
		// 14
		return 4;
	}else if (a >= 12 && a < 14) {
		// 12 13
		return 3;
	}else if (a >= 9 && a < 12) {
		// 9 10 11
		return 2;
	}else if (a >= 5 && a < 9) {
		// 5 6 7 8
		return 1;
	}else{
		// 0 1 2 3 4
		return 0;
	}
}

function random_cel01(){
	return (Math.random()*4)>>0;
}
function random_cel0(){
	let a = (Math.random()*10)>>0;
	if (a == 9) {
		// 9
		return 3;
	}else if (a >= 7 && a < 8) {
		// 7 8
		return 2;
	}else if (a >= 4 && a < 7) {
		// 4 5 6
		return 1;
	}else{
		// 0 1 2 3
		return 0;
	}
}

function check_win(data, line){
	let win_icon = 0;
	let number_win = null;
	let arrT   = [];           // Mảng lọc các bộ
	for (let i = 0; i < 5; i++) {
		let dataT = data[i];
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}

	arrT.forEach(function(c, index) {
		if (c === 5) {
			win_icon = index;
			number_win = 5;
		}
		if (c === 4) {
			win_icon = index;
			number_win = 4;
		}
		if (c === 3 && index > 0) {
			win_icon = index;
			number_win = 3;
		}
	});

	data = null;
	arrT = null;
	return {line:line, win:win_icon, type:number_win};
}

function gameBonusX(bet, x){
	if (x == 0) {
		return (bet*((Math.random()*(15-2+1))+2))>>0;
	}else{
		return bet*x;
	}
}

function gameBonus(client, bet){
	let map = [
		gameBonusX(bet, 0),
		gameBonusX(bet, 0),
		gameBonusX(bet, 0),
		gameBonusX(bet, 0),
		gameBonusX(bet, 0),
		gameBonusX(bet, 0),
		gameBonusX(bet, 0),
		gameBonusX(bet, 16),
		gameBonusX(bet, 4),
		gameBonusX(bet, 4),
		gameBonusX(bet, 5),
		gameBonusX(bet, 3),
		gameBonusX(bet, 3),
		gameBonusX(bet, 3),
		gameBonusX(bet, 2),
		gameBonusX(bet, 2),
		gameBonusX(bet, 2),
		gameBonusX(bet, 2),
		gameBonusX(bet, 2),
		gameBonusX(bet, 2)
	];

	map = Helpers.shuffle(map); // tráo bài lần 1
	map = Helpers.shuffle(map); // tráo bài lần 2
	map = Helpers.shuffle(map); // tráo bài lần 3

	Promise.all(map.map(function(obj){
		return {isOpen:false, bet:obj};
	}))
	.then(result => {
		client.VuongQuocRed.bonus = result;
	});
}

module.exports = function(client, data){
	if (!!data && !!data.cuoc && Array.isArray(data.line)) {
		let bet  = data.cuoc>>0;             // Mức cược
		let line = Array.from(new Set(data.line)); // Dòng cược // fix trùng lặp
		if (!(bet == 100 || bet == 1000 || bet == 10000) || line.length < 1) {
			client.red({VuongQuocRed:{status:0}, notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'THẤT BẠI'}});
		}else{
			client.VuongQuocRed = void 0 === client.VuongQuocRed ? {id:'', bet:bet, bonus:null, bonusX:0, bonusL:0, bonusWin:0, free:0} :client.VuongQuocRed;
			client.VuongQuocRed.bet = bet;
			let tongCuoc = bet*line.length;
			UserInfo.findOne({id:client.UID}, 'red name', function(err, user){
				if (!user || client.VuongQuocRed.free === 0 && user.red < tongCuoc) {
					client.red({VuongQuocRed:{status:0, notice:'Bạn không đủ số dư'}});
				}else{
					let config = Helpers.getConfig('vqred');
					let addQuy = (tongCuoc*0.005)>>0;

					let line_nohu = 0;
					let bet_win  = 0;
					let free     = 0;
					let bonusX   = 0;
					let type     = 0;   // Loại được ăn lớn nhất trong phiên
					let isFree   = false;
					let nohu     = false;
					let isBigWin = false;
					// tạo kết quả
					HU.findOne({game:'vuongquocred', type:bet}, {}, function(err2, dataHu){
						if (dataHu === null){
							return void 0;
						}
						let uInfo      = {hu:0};
						let mini_users = {hu:0};
						let huUpdate   = {bet:addQuy, hu:0};
						let celSS = null;
						if (config.chedo == 0) {
							// chế độ khó
							celSS = [
								random_cel3(), random_cel3(), random_cel2(),
								random_cel2(), random_cel2(), random_cel1(),
								random_cel0(), 3,             2,
								2,             1,             1,
								0,             0,             0,
							];
						}else if(config.chedo == 1){
							// trung bình
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), random_cel2(), random_cel2(),
								random_cel1(), random_cel0(), random_cel0(),
								2,             1,             1,
								0,             0,             3,
							];
						}else{
							// chế độ dễ
							celSS = [
								random_cel3(), random_cel2(), random_cel2(),
								random_cel2(), random_cel2(), random_cel2(),
								random_cel1(), random_cel0(), 3,
								2,             1,             1,
								0,             0,             0,
							];
						}

						celSS = Helpers.shuffle(celSS); // tráo bài lần 1
						celSS = Helpers.shuffle(celSS); // tráo bài lần 2
						celSS = Helpers.shuffle(celSS); // tráo bài lần 3

						let cel1 = [celSS[0],  celSS[1],  celSS[2]];  // Cột 1
						let cel2 = [celSS[3],  celSS[4],  celSS[5]];  // Cột 2
						let cel3 = [celSS[6],  celSS[7],  celSS[8]];  // Cột 3
						let cel4 = [celSS[9],  celSS[10], celSS[11]]; // Cột 4
						let cel5 = [celSS[12], celSS[13], celSS[14]]; // Cột 5

						let quyHu     = dataHu.bet;
						let checkName = (client.profile.name == dataHu.name);
						if (checkName) {
							line_nohu = ((Math.random()*line.length)>>0);
							line_nohu = line[line_nohu];
						}

						// kiểm tra kết quả
						Promise.all(line.map(function(selectLine){
							switch(selectLine){
								case 1:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
										cel4[1] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[1], cel4[1], cel5[1]], selectLine);
									break;

								case 2:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
										cel4[0] = 5;
										cel5[0] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[0], cel4[0], cel5[0]], selectLine);
									break;

								case 3:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
										cel4[2] = 5;
										cel5[2] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[2], cel4[2], cel5[2]], selectLine);
									break;

								case 4:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
										cel4[1] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[0], cel4[1], cel5[1]], selectLine);
									break;

								case 5:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
										cel4[1] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[2], cel4[1], cel5[1]], selectLine);
									break;

								case 6:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
										cel4[0] = 5;
										cel5[0] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[1], cel4[0], cel5[0]], selectLine);
									break;

								case 7:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
										cel4[2] = 5;
										cel5[2] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[1], cel4[2], cel5[2]], selectLine);
									break;

								case 8:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[0] = 5;
										cel4[2] = 5;
										cel5[0] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[0], cel4[2], cel5[0]], selectLine);
									break;

								case 9:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[0] = 5;
										cel3[2] = 5;
										cel4[0] = 5;
										cel5[2] = 5;
									}
									return check_win([cel1[2], cel2[0], cel3[2], cel4[0], cel5[2]], selectLine);
									break;

								case 10:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[2] = 5;
										cel4[0] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[2], cel4[0], cel5[1]], selectLine);
									break;

								case 11:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
										cel4[1] = 5;
										cel5[2] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[0], cel4[1], cel5[2]], selectLine);
									break;

								case 12:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
										cel4[1] = 5;
										cel5[0] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[2], cel4[1], cel5[0]], selectLine);
									break;

								case 13:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
										cel4[0] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[1], cel4[0], cel5[1]], selectLine);
									break;

								case 14:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
										cel4[2] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[1], cel4[2], cel5[1]], selectLine);
									break;

								case 15:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
										cel4[1] = 5;
										cel5[2] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[1], cel4[1], cel5[2]], selectLine);
									break;

								case 16:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
										cel4[1] = 5;
										cel5[0] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[1], cel4[1], cel5[0]], selectLine);
									break;

								case 17:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
										cel4[2] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[2], cel4[2], cel5[1]], selectLine);
									break;

								case 18:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
										cel4[0] = 5;
										cel5[1] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[0], cel4[0], cel5[1]], selectLine);
									break;

								case 19:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
										cel4[0] = 5;
										cel5[0] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[1], cel4[0], cel5[0]], selectLine);
									break;

								case 20:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
										cel4[2] = 5;
										cel5[2] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[1], cel4[2], cel5[2]], selectLine);
									break;
							}
						}))
						.then(result => {
							result = result.filter(function(line_win){
								let checkWin = false;
								if (line_win.win == 6) {
									if (line_win.type === 5) {
										checkWin = true;
										// x8000
										bet_win += bet*8000;
									}else if (line_win.type === 4){
										// Bonus x5
										checkWin = true;
										bonusX += 5;
									}else if (line_win.type === 3){
										// Bonus x1
										checkWin = true;
										bonusX += 1;
									}
								}else if(line_win.win == 5) {
									if (line_win.type === 5) {
										checkWin = true;
										// Nổ Hũ
										type = 2;
										if (!nohu) {
											let okHu = (quyHu-Math.ceil(quyHu*2/100))>>0;
											bet_win += okHu;
											HU.updateOne({game:'vuongquocred', type:bet}, {$set:{name:'', bet:dataHu.min}}).exec();
											//client.redT.sendInHome({pushnohu:{title:'Miền Viễn Tây', name:client.profile.name, bet:okHu}});
										}else{
											let okHu = (dataHu.min-Math.ceil(dataHu.min*2/100))>>0;
											bet_win += okHu;
											//client.redT.sendInHome({pushnohu:{title:'Miền Viễn Tây', name:client.profile.name, bet:okHu}});
										}
										huUpdate.hu += 1;
										uInfo.hu += 1;
										mini_users.hu += 1;
										nohu = true;
									}else if (!nohu && line_win.type === 4){
										// x30
										checkWin = true;
										bet_win += bet*30;
									}else if (!nohu && line_win.type === 3){
										// x5
										checkWin = true;
										bet_win += bet*5;
									}
								}else if(line_win.win == 4) {
									if (line_win.type === 5) {
										checkWin = true;
										// free x15
										free += 15;
										isFree = true;
									}else if (line_win.type === 4){
										// free x5
										checkWin = true;
										free += 5;
										isFree = true;
									}else if (line_win.type === 3){
										// free x1
										checkWin = true;
										free += 1;
										isFree = true;
									}
								}else if(!nohu && line_win.win == 3) {
									if (line_win.type === 5) {
										checkWin = true;
										// x500
										bet_win += bet*500;
									}else if (line_win.type === 4){
										// x20
										checkWin = true;
										bet_win += bet*20;
									}else if (line_win.type === 3){
										// x4
										checkWin = true;
										bet_win += bet*4;
									}
								}else if(!nohu && line_win.win == 2) {
									if (line_win.type === 5) {
										checkWin = true;
										// x200
										bet_win += bet*200;
									}else if (line_win.type === 4){
										// x15
										checkWin = true;
										bet_win += bet*15;
									}else if (line_win.type === 3){
										// x3
										checkWin = true;
										bet_win += bet*3;
									}
								}else if(!nohu && line_win.win == 1) {
									if (line_win.type === 5) {
										checkWin = true;
										// x75
										bet_win += bet*75;
									}else if (line_win.type === 4){
										// x10
										checkWin = true;
										bet_win += bet*10;
									}else if (line_win.type === 3){
										// x2
										checkWin = true;
										bet_win += bet*2;
									}
								}else if(!nohu && line_win.win == 0) {
									if (line_win.type === 5) {
										checkWin = true;
										// x30
										bet_win += bet*30;
									}else if (line_win.type === 4){
										// x6
										checkWin = true;
										bet_win += bet*6;
									}
								}
								return checkWin;
							});
							let tien = 0;
							if (client.VuongQuocRed.free > 0) {
								tien = bet_win;
								client.VuongQuocRed.free -= 1;
							}else{
								tien = bet_win-tongCuoc;
							}
							if (!nohu && bet_win >= tongCuoc*2.24) {
								isBigWin = true;
								//type = 1;
								bet_win >= 10000 && client.redT.sendInHome({news:{t:{game:'Miền Viễn Tây', users:client.profile.name, bet:bet_win, status:2}}});
							}
							if (free > 0) {
								client.VuongQuocRed.free += free;
							}
							if (!!bonusX) {
								client.VuongQuocRed.bonusX += bonusX;
								client.VuongQuocRed.bonusL = 10;
								gameBonus(client, bet);
							}

							uInfo.red = tien;
							uInfo.totall = tien;
							huUpdate.redPlay = tongCuoc;
							uInfo.redPlay = tongCuoc;
							mini_users.bet = tongCuoc;
							mini_users.totall = tien;
							tienthang = user.red-tongCuoc;
							if (tien > 0){
								huUpdate.redWin = tien;
								uInfo.redWin = tien;
								mini_users.win = tien;         // Cập nhật Số Red đã Thắng
							}
							if (tien < 0){
								let tienLost = tien*-1;
								huUpdate.redLost = tienLost;
								uInfo.redLost = tienLost;
								mini_users.lost = tienLost; // Cập nhật Số Red đã Thua
							}

							client.red({VuongQuocRed:{status:1, cel:[cel1, cel2, cel3, cel4, cel5], line_win:result, win:bet_win, free:client.VuongQuocRed.free, isFree:isFree, isBonus:!!client.VuongQuocRed.bonusX, isNoHu:nohu, isBigWin:isBigWin}, user:{red:user.red-tongCuoc}});
							VuongQuocRed_red.create({'uid':client.UID, dichvu:'Miền Viễn Tây', 'lswin':uInfo.red, 'tienhienco':tienthang*1+bet_win, 'name':client.profile.name, 'type':type, 'win':bet_win, 'bet':bet, 'kq':result.length, 'line':line.length, 'time':new Date()}, function (err4, small) {
								//LScuoc.create({'uid':client.UID, 'game':'Miền Viễn Tây', 'betwin':tien, 'bet':tongCuoc, 'tienhienco':tienthang, 'phien':small.id, 'select':1, time:new Date()});
								client.VuongQuocRed.id = small._id.toString();
							});

							
							HU.updateOne({game:'vuongquocred', type:bet}, {$inc:huUpdate}).exec();
							UserInfo.updateOne({id:client.UID},{$inc:uInfo}).exec();
							VuongQuocRed_users.updateOne({'uid':client.UID}, {$set:{time:new Date().getTime(), select:bet}, $inc:mini_users}).exec();

							let vipStatus = Helpers.getConfig('topVip');
							if (!!vipStatus && vipStatus.status === true) {
								TopVip.updateOne({'name':client.profile.name}, {$inc:{vip:tongCuoc}}).exec(function(errV, userV){
									if (!!userV && userV.n === 0) {
										try{
							    			TopVip.create({'name':client.profile.name, 'vip':tongCuoc});
										} catch(e){
										}
									}
								});
							}
						});
					});
				}
			});
		}
	}
};
