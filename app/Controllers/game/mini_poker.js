
let HU             = require('../../Models/HU');
let miniPokerUsers = require('../../Models/miniPoker/miniPoker_users');

let miniPokerRed = require('../../Models/LichSu_Cuoc');
var LScuoc        = require('../../Models/LichSu_Cuoc');
let TopVip    = require('../../Models/VipPoint/TopVip');
let UserInfo  = require('../../Models/UserInfo');
let Helpers   = require('../../Helpers/Helpers');
let base_card = require('../../../data/card');

function spin(client, data){
	if (!!data && !!data.cuoc) {
		let game = 'Mini Poker';
		let bet = data.cuoc>>0; // Mức cược
		if (!(bet == 100 || bet == 1000 || bet == 10000)) {
			client.red({mini:{poker:{status:0}}, notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'MINI POKER'}});
		}else{
			UserInfo.findOne({id:client.UID}, 'red name', function(err, user){
				if (!user || user.red < bet) {
					client.red({mini:{poker:{status:0, notice:'Bạn không đủ số dư'}}});
				}else{
					let UID  = client.UID;
					let name = client.profile.name;
					let addQuy  = (bet*0.01)>>0;
					let an      = 0;
					let code    = 0;
					let type    = 0;
					let text    = '';
					let thuong  = 0;
					let card    = [...base_card.card];

					// tráo bài
					card = Helpers.shuffle(card); // tráo bài lần 1
					card = Helpers.shuffle(card); // tráo bài lần 2
					card = Helpers.shuffle(card); // tráo bài lần 3

					//var ketqua  = [];            // bốc nhẫu nhiên
					let ketqua      = card.slice(0, 5); // bốc 5 thẻ đầu tiên

					let ketqua_temp = [...ketqua]; // copy kết quả để sử lý, (tránh sắp sếp, mất tính ngẫu nhiên)

					let arrT   = [];           // Mảng chứa các bộ (Đôi, Ba, Bốn) trong bài
					for (let i = 0; i < 5; i++) {
						let dataT = ketqua[i];
						if (void 0 === arrT[dataT.card]) {
							arrT[dataT.card] = 1;
						}else{
							arrT[dataT.card] += 1;
						}
						dataT = null;
					}

					let tuQuy   = null;  // Tên bộ tứ
					let bo2     = 0;     // bộ 2 (có bao nhiêu 2)
					let bo2_a   = [];    // Danh sách tên bộ 2
					let bo3     = false; // bộ ba (có bao nhiêu bộ 3)
					let bo3_a   = null;  // Tên bộ 3

					arrT.forEach(function(c, index) {
						if (c === 4) {
							tuQuy = index;
						}
						if (c === 3) {
							bo3   = true;
							bo3_a = index;
						}
						if (c === 2) {
							bo2++;
							bo2_a[bo2_a.length] = index;
						}
					});

					let typeCard = ketqua[0].type; // chất đầu tiên
					let dongChat = ketqua_temp.filter(type_card => type_card.type === typeCard); // Kiểm tra đồng chất
					dongChat     = dongChat.length == 5 ? true :false;  // Dây là đồng chất

					let AK    = ketqua_temp.sort(function(a, b){return a.card - b.card}); // sắp sếp từ A đến K (A23...JQK)
					let isDay = false; // là 1 dây
					if (bo3 == false && bo2 == 0 && tuQuy == null) {
						if (AK[4].card-AK[0].card === 4 || (AK[4].card-AK[1].card === 3 && AK[0].card === 0 && AK[4].card === 12)) {
							isDay = true;
						}
					}

					HU.findOne({game:'minipoker', type:bet}, 'name bet min toX balans x', function(err, dataHu){
						if (dataHu === null) {
							return void 0;
						}
						let uInfo      = {};
						let mini_users = {};
						let huUpdate   = {bet:addQuy, toX:0, balans:0};

						let quyHu     = dataHu.bet;
						let quyMin    = dataHu.min;

						let toX       = dataHu.toX;
						let balans    = dataHu.balans;

						let checkName = (name == dataHu.name);

						if (checkName || (dongChat && isDay && AK[4].card > 9)) {
							// NỔ HŨ (DÂY ĐỒNG CHẤT CỦA DÂY ĐẾN J TRỞ LÊN) Hoặc được xác định là nổ hũ
							if (toX > 0) {
								toX -= 1;
								huUpdate.toX -= 1;
							}else if (balans > 0) {
								balans -= 1;
								huUpdate.balans -= 1;
							}
							if (toX < 1 && balans > 0) {
								quyMin = quyMin*dataHu.x;
							}
							HU.updateOne({game:'minipoker', type:bet}, {$set:{name:'', bet:quyMin}}).exec();
							if (checkName){
								// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
								let randomType = (Math.random()*4)>>0;           // Ngẫu nhiên chất bài
								let randomMin  = ((Math.random()*(9-6+1))+6)>>0; // Ngẫu nhiên dây bài bắt đầu từ (7 - 10)
								card = base_card.card.filter(function(cardT){
									if (randomMin == 9 && cardT.card == 0 && cardT.type == randomType) {
										return true;
									}else if (cardT.card >= randomMin && cardT.card < randomMin+5 && cardT.type == randomType) {
										return true;
									}
									return false;
								})
								ketqua = Helpers.shuffle(card); // tráo bài
								randomType = null;
								randomMin = null;
							}
							an   = (quyHu-Math.ceil(quyHu*2/100))>>0;

							client.redT.sendInHome({pushnohu:{title:'MINI POKER', name:name, bet:an}});
							huUpdate['hu']   = uInfo['hu']   = mini_users['hu']   = 1; // Cập nhật Số Hũ Red đã Trúng

							text = 'Nổ Hũ';
							code = 2;
							type = 2;
						}else if (isDay && dongChat) {
							// x1000    THÙNG PHÁ SẢNH (DÂY ĐỒNG CHẤT)
							an   = (bet*1000);
							text = 'Thắng Lớn';
							code = 1;
							client.redT.sendInHome({news:{t:{game:'MINI POKER', users:name, bet:an, status:2}}});
						}else if (tuQuy != null) {
							// x150     TỨ QUÝ (TỨ QUÝ)
							an   = (bet*150);
							text = 'Tứ Quý';
							code = 1;
							client.redT.sendInHome({news:{t:{game:'MINI POKER', users:name, bet:an, status:2}}});
						}else if (bo3 && bo2 > 0) {
							// x50      CÙ LŨ (1 BỘ 3 VÀ 1 BỘ 2)
							an   = (bet*50);
							text = 'Cù Lũ';
						}else if (dongChat) {
							// x20		THÙNG (ĐỒNG CHẤT)
							an   = (bet*20);
							text = 'Thùng';
						}else if (isDay && !dongChat) {
							// x13		SẢNH (DÂY)
							an   = (bet*13);
							text = 'Sảnh';
						}else if (bo3 && bo2 == 0) {
							// x8 		SÁM CÔ (1 BỘ 3)
							an   = (bet*8);
							text = 'Sám';
						}else if (bo2 > 1) {
							// x5	 	THÚ (2 ĐÔI)
							an   = (bet*5);
							text = 'Thú';
						}else if (bo2 == 1 && (bo2_a[0] > 9 || bo2_a[0] == 0)) {
							// x2.5	 	1 ĐÔI > J
							an   = (bet*2.5);
							text = 'Đôi ' + base_card.name[bo2_a[0]];
						}
						card     = null;
						let tien = an-bet;
						uInfo['red'] = tien;         // Cập nhật Số dư Red trong tài khoản
						uInfo['totall'] = tien;
						mini_users['totall'] = tien;
						nhan = an-bet;
						huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = bet;       // Cập nhật Số Red đã chơi
						if (tien > 0){
							huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien;    // Cập nhật Số Red đã Thắng
						}
						if (tien < 0){
							huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
		
						}
						if (code === 2){
							uInfo['hu'] = mini_users['hu'] = 1;         // Cập nhật Số Hũ Red đã Trúng
						}
						miniPokerRed.create({'uid':UID,'dichvu':game,'name':name, 'win':an, 'bet':bet, 'tienhienco':user.red*1+tien , 'lswin':tien,'type':type, 'kq':ketqua, 'time':new Date()}, function (err, small) {
							if (err){
								client.red({mini:{poker:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
							}else{
								//LScuoc.create({'uid':UID, 'game':game, 'betwin':nhan, 'bet':bet, tienhienco:user.red, 'phien':small.id, 'select':1, time:new Date()});
								client.red({mini:{poker:{status:1, card:ketqua, phien:small.id, win:an, text:text, code:code}}, user:{red:user.red-bet}});
							}
							ketqua = null;
							client = null;
							data   = null;
							small  = null;
							an     = null;
							user   = null;
							text   = null;
						});
						HU.updateOne({game:'minipoker', type:bet}, {$inc:huUpdate}).exec();
						UserInfo.updateOne({id:UID}, {$inc:uInfo}).exec();
						miniPokerUsers.updateOne({'uid':UID}, {$set:{time:new Date().getTime(), select:bet}, $inc:mini_users}).exec();

						let vipStatus = Helpers.getConfig('topVip');
						if (!!vipStatus && vipStatus.status === true) {
							TopVip.updateOne({'name':name}, {$inc:{vip:bet}}).exec(function(errV, userV){
								if (!!userV && userV.n === 0) {
									try{
						    			TopVip.create({'name':name, 'vip':bet});
									} catch(e){
									}
								}
							});
						}
					});
				}
			});
		}
	}
}

function log(client, data){
	if (!!data && !!data.page) {
		let page = data.page>>0; // trang
		if (page < 1) {
			client.red({notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'MINI POKER'}});
		}else{
			let kmess = 9;
			miniPokerRed.countDocuments({'dichvu':'Mini Poker', 'name':client.profile.name}).exec(function(err, total){
				miniPokerRed.find({'dichvu':'Mini Poker', 'name':client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({mini:{poker:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
					})
				});
			})
		}
	}
}

function top(client){
	miniPokerRed.find({'dichvu':'Mini Poker', type:2}, 'name win bet time type', {sort:{'_id':-1}, limit:50}, function(err, result) {
		Promise.all(result.map(function(obj){
			obj = obj._doc;
			delete obj.__v;
			delete obj._id;
			return obj;
		}))
		.then(function(arrayOfResults) {
			client.red({mini:{poker:{top:arrayOfResults}}});
		})
	});
}

module.exports = function(client, data){
	if (!!data.spin) {
		spin(client, data.spin);
	}
	if (!!data.log) {
		log(client, data.log);
	}
	if (void 0 !== data.top) {
		top(client);
	}
}
