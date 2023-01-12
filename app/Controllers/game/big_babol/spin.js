
let HU             = require('../../../Models/HU');
let BigBabol_red   = require('../../../Models/LichSu_Cuoc');
let BigBabol_users = require('../../../Models/BigBabol/BigBabol_users');
let TopVip         = require('../../../Models/VipPoint/TopVip');
let UserInfo     = require('../../../Models/UserInfo');
var LScuoc        = require('../../../Models/LichSu_Cuoc');
let Helpers      = require('../../../Helpers/Helpers');

function random_cel3(){
	return (Math.random()*6)>>0;
}

function random_cel2(){
	let a = (Math.random()*21)>>0;
	if (a == 20) {
		// 20
		return 5;
	}else if (a >= 18 && a < 20) {
		// 18 19
		return 4;
	}else if (a >= 15 && a < 18) {
		// 15 16 17
		return 3;
	}else if (a >= 11 && a < 15) {
		// 11 12 13 14
		return 2;
	}else if (a >= 6 && a < 11) {
		// 6 7 8 9 10
		return 1;
	}else{
		// 0 1 2 3 4 5
		return 0;
	}
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

function check_win(data, line){
	let win_icon = 0;
	let heso     = 0;
	let win_type = null;
	let thaythe  = 0;  // Thay Thế (WinD)
	let arrT     = []; // Mảng lọc các bộ
	for (let i = 0; i < 3; i++) {
		let dataT = data[i];
		if (dataT == 5) {
			++thaythe;
		}
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}

	arrT.forEach(function(c, index) {
		if (index != 5) {
			arrT[index] += thaythe;
		}
	});

	arrT.forEach(function(c, index) {
		if (c === 3) {
			win_icon = index;
			win_type = 3;
		}
		if (c === 2 && (index == 0 || index == 1)) {
			win_icon = index;
			win_type = 2;
			if (index == 0) {
				heso += 0.4;
			}else{
				heso += 0.8;
			}
		}
	});

	data = null;
	thaythe = null;
	arrT    = null;

	return {line:line, win:win_icon, type:win_type, heso:heso};
}

module.exports = function(client, data){
	if (!!data && !!data.cuoc && Array.isArray(data.line)) {
		let bet  = data.cuoc>>0;                   // Mức cược
		let line = Array.from(new Set(data.line)); // Dòng cược // fix trùng lặp
		if (!(bet == 100 || bet == 1000 || bet == 10000) || line.length < 1) {
			client.red({mini:{big_babol:{status:0}}, notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'THẤT BẠI'}});
		}else{
			let cuoc = bet*line.length;  // Tiền cược
			UserInfo.findOne({id:client.UID}, 'red name', function(err, user){
				if (!user || user.red < cuoc) {
					client.red({mini:{big_babol:{status:0, notice:'Bạn không đủ số dư'}}});
				}else{
					let config = Helpers.getConfig('bigbabol');
					let addQuy = (cuoc*0.005)>>0;

					let line_nohu = 0;
					let win_arr   = null;
					let bet_win   = 0;
					let type      = 0;   // Loại được ăn lớn nhất trong phiên
					// tạo kết quả
					HU.findOne({game:'bigbabol', type:bet}, 'name bet min toX balans x', function(err, dataHu){
						let uInfo      = {hu:0};
						let mini_users = {hu:0};
						let huUpdate   = {bet:addQuy, toX:0, balans:0, hu:0};
						let celSS = null;
						if (config.chedo == 0) {
							// khó
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								3,             1,             2,
								1,             0,             0,
							];
						}else if (config.chedo == 1) {
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), 2,             1,
								1,             0,             0,
							];
						}else{
							// dễ
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), random_cel1(), 1,
								1,             0,             0,
							];
						}
						celSS = Helpers.shuffle(celSS); // tráo bài lần 1
						celSS = Helpers.shuffle(celSS); // tráo bài lần 2
						let cel1 = [celSS[0], celSS[1], celSS[2]]; // Cột 1
						let cel2 = [celSS[3], celSS[4], celSS[5]]; // Cột 2
						let cel3 = [celSS[6], celSS[7], celSS[8]]; // Cột 3
						let nohu      = false;
						let isBigWin  = false;
						let quyHu     = dataHu.bet;
						let quyMin    = dataHu.min;
						let toX      = dataHu.toX;
						let balans   = dataHu.balans;
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
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[0]], selectLine);
									break;

								case 2:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[1]], selectLine);
									break;

								case 3:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[2]], selectLine);
									break;

								case 4:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[0]], selectLine);
									break;

								case 5:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[0] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[0], cel3[2]], selectLine);
									break;

								case 6:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[0]], selectLine);
									break;

								case 7:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[2]], selectLine);
									break;

								case 8:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[0]], selectLine);
									break;

								case 9:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[1]], selectLine);
									break;

								case 10:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[1]], selectLine);
									break;

								case 11:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[2]], selectLine);
									break;

								case 12:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[1]], selectLine);
									break;

								case 13:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[2]], selectLine);
									break;

								case 14:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[0]], selectLine);
									break;

								case 15:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[1]], selectLine);
									break;

								case 16:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[0]], selectLine);
									break;

								case 17:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[1]], selectLine);
									break;

								case 18:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[1]], selectLine);
									break;

								case 19:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[2]], selectLine);
									break;

								case 20:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[1]], selectLine);
									break;
							}
						}))
						.then(result => {
							result = result.filter(function(line_win){
								if (line_win.type != null) {
									if(line_win.win == 5) {
										// Nổ hũ
										if (toX > 0) {
											toX -= 1;
											huUpdate.toX -= 1;
										}else if (balans > 0) {
											balans -= 1;
											huUpdate.balans -= 1;
										}
										if (toX < 1 && balans > 0) {
											quyMin = dataHu.min*dataHu.x;
										}
										if (!nohu) {
											var okHu = (quyHu-Math.ceil(quyHu*2/100))>>0;
											bet_win += okHu;
											client.redT.sendInHome({pushnohu:{title:'Candy', name:client.profile.name, bet:okHu}});
										}else{
											var okHu = (quyMin-Math.ceil(quyMin*2/100))>>0;
											bet_win += okHu;
											client.redT.sendInHome({pushnohu:{title:'Candy', name:client.profile.name, bet:okHu}});
										}
										HU.updateOne({game:'bigbabol', type:bet}, {$set:{name:'', bet:quyMin}}).exec();
										huUpdate['hu'] = uInfo['hu'] = mini_users['hu'] += 1;
										nohu = true;
										type = 2;
									}else if(!nohu && line_win.win == 4) {
										// x80
										bet_win += bet*80;
									}else if(!nohu && line_win.win == 3) {
										// x40
										bet_win += bet*40;
									}else if(!nohu && line_win.win == 2) {
										// x20
										bet_win += bet*20;
									}else if(!nohu && line_win.win == 1 && line_win.type == 3) {
										// x8
										bet_win += bet*8;
									}else if(!nohu && line_win.win == 1 && line_win.type == 2) {
										//	x0.8
										bet_win += (bet*line_win.heso)>>0;
									}else if(!nohu && line_win.win == 0 && line_win.type == 3) {
										// x4
										bet_win += bet*4;
									}else if(!nohu && line_win.win == 0 && line_win.type == 2) {
										// x0.4
										bet_win += (bet*line_win.heso)>>0;
									}
								}
								return (line_win.type != null);
							});

							let tien = bet_win-cuoc;
							if (!nohu && bet_win >= cuoc*2.24) {
								isBigWin = true;
								//type = 1;
								bet_win >= 10000 && client.redT.sendInHome({news:{t:{game:'Candy', users:client.profile.name, bet:bet_win, status:2}}});
							}
							uInfo['red'] = tien;                                                 // Cập nhật Số dư Red trong tài khoản
							uInfo['totall'] = tien;
							huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = cuoc;   // Cập nhật Số Red đã chơi
							mini_users['totall'] = tien;
							if (tien > 0){
								huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien; // Cập nhật Số Red đã Thắng
							}
							if (tien < 0){
								huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
							}
							BigBabol_red.create({'uid':client.UID,'dichvu':'Candy', 'tienhienco':user.red*1+tien , 'lswin':tien, 'name':client.profile.name, 'type':type, 'win':bet_win, 'bet':bet, 'kq':result.length, 'line':line.length, 'time':new Date()}, function (err, small) {
								if (err){
									client.red({mini:{big_babol:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
								}else{
									//LScuoc.create({'uid':client.UID, 'game':'Candy', 'betwin':tien, 'bet':cuoc, tienhienco:user.red, 'phien':small.id, 'select':1, time:new Date()});
									client.red({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win:result, nohu:nohu, isBigWin:isBigWin, win:bet_win, phien:small.id}}, user:{red:user.red-cuoc}});
								}
							});

				
							HU.updateOne({game:'bigbabol', type:bet}, {$inc:huUpdate}).exec();
							UserInfo.updateOne({id:client.UID}, {$inc:uInfo}).exec();
							BigBabol_users.updateOne({'uid':client.UID}, {$set:{time:new Date().getTime(), select:bet}, $inc:mini_users}).exec();
							let vipStatus = Helpers.getConfig('topVip');
							if (!!vipStatus && vipStatus.status === true) {
								TopVip.updateOne({'name':client.profile.name}, {$inc:{vip:cuoc}}).exec(function(errV, userV){
									if (!!userV && userV.n === 0) {
										try{
							    			TopVip.create({'name':client.profile.name, 'vip':cuoc});
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
