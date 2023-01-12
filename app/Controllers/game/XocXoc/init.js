
let fs           = require('fs');
let XocXoc_phien = require('../../../Models/XocXoc/XocXoc_phien');
let XocXoc_cuoc  = require('../../../Models/XocXoc/XocXoc_cuoc');
let XocXoc_user  = require('../../../Models/XocXoc/XocXoc_user');
let UserInfo     = require('../../../Models/UserInfo');
let Helpers      = require('../../../Helpers/Helpers');

let XocXoc = function(io){
	this.io           = io;
	this.clients      = {};
	this.time         = 0;
	this.timeInterval = null;
	this.phien        = 1;
	this.botList      = [];
	this.botCount     = 0;
	this.ingame = {red:{}};
	this.chip = {
		'chan':   {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'le':     {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'red3':   {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'red4':   {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'white3': {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'white4': {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
	};
	this.data = {
		'red': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
	};
	this.dataAdmin = {
		'red': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
	};
	XocXoc_phien.findOne({}, 'id', {sort:{'_id':-1}}, function(err, last) {
		if (!!last){
			this.phien = last.id+1;
		}
		this.play();
	}.bind(this));
}

XocXoc.prototype.play = function(){
	// chạy thời gian
	this.time = 43;
	this.timeInterval = setInterval(function(){
		if (this.time < 30) {
			if (this.time < 0) {
				clearInterval(this.timeInterval);
				this.time = 0;
				this.resetData();
				this.resetDataAdmin();
				let xocxocjs = Helpers.getData('xocxoc');
				if(!!xocxocjs){
					let red1 = xocxocjs.red1 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red1;
					let red2 = xocxocjs.red2 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red2;
					let red3 = xocxocjs.red3 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red3;
					let red4 = xocxocjs.red4 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red4;
					xocxocjs.red1 = 2;
					xocxocjs.red2 = 2;
					xocxocjs.red3 = 2;
					xocxocjs.red4 = 2;
					Helpers.setData('xocxoc', xocxocjs);
					xocxocjs = null;
					XocXoc_phien.create({'red1':red1, 'red2':red2, 'red3':red3, 'red4':red4, 'time':new Date()}, function(err, create){
						if (!!create) {
							this.phien = create.id+1;
							this.thanhtoan([red1, red2, red3, red4]);
							this.timeInterval = null;
							Object.values(this.clients).forEach(function(client){
								client.red({xocxoc:{phien:create.id, finish:[red1, red2, red3, red4]}});
							});
							Object.values(this.io.admins).forEach(function(admin){
								admin.forEach(function(client){
									client.red({xocxoc:{finish:[red1, red2, red3, red4]}});
								});
							});
						}
					}.bind(this));
				}
				let xocxoc_config = Helpers.getConfig('xocxoc');
				if (!!xocxoc_config && xocxoc_config.bot && !!this.io.listBot && this.io.listBot.length > 0) {
					// lấy danh sách tài khoản bot
					this.botList = [...this.io.listBot];
					let maxBot = (this.botList.length*(Math.floor(Math.random()*(70-50+1))+50)/100)>>0;
					this.botList = Helpers.shuffle(this.botList);
					this.botList = this.botList.slice(0, maxBot);
					this.botCount = this.botList.length;

					let cc = Object.keys(this.clients).length+this.botCount;
					Object.values(this.clients).forEach(function(users){
						users.red({xocxoc:{ingame:{client:cc}}});
					}.bind(this));
				}else{
					this.botList  = [];
					this.botCount = 0;
				}
			}else{
				this.thanhtoan();
				///**
				if (!!this.botList.length && this.time > 8) {
					let userCuoc = (Math.random()*18)>>0;
					for (let i = 0; i < userCuoc; i++) {
						let dataT = this.botList[i];
						if (!!dataT) {
							this.bot(dataT);
							this.botList.splice(i, 1); // Xoá bot đã đặt tránh trùng lặp
						}
						dataT = null;
					}
				}
				//*/
			}
		}
		this.time--;
	}.bind(this), 1000);
	return void 0;
}
XocXoc.prototype.thanhtoan = function(dice = null){
	// thanh toán phiên
	if (!!dice) {
		let gameChan = 0;     // Là chẵn
		dice.forEach(function(kqH){
			if (kqH) {
				gameChan++;
			}
		});
		let red    = gameChan;
		let white  = 4-gameChan;

		let red3   = (red == 3);   // 3 đỏ
		let red4   = (red == 4);   // 4 đỏ
		let white3 = (white == 3); // 3 trắng
		let white4 = (white == 4); // 4 trắng
		red    = null;
		white  = null;
		gameChan = !(gameChan%2); // game là chẵn
		let phien = this.phien-1;
		XocXoc_cuoc.find({phien:phien}, {}, function(err, list) {
			if (list.length) {
				Promise.all(list.map(function(cuoc){
					let tongDat   = cuoc.chan+cuoc.le+cuoc.red3+cuoc.red4+cuoc.white3+cuoc.white4;
					let TongThang = 0; // Tổng tiền thắng (đã tính gốc)
					let totall = 0; // Số tiền thắng / thua
					// Cược Chẵn
					if (cuoc.chan > 0) {
						if (gameChan) {
							totall    += cuoc.chan;
							TongThang += cuoc.chan*1.98;
						}else{
							totall    -= cuoc.chan;
						}
					}
					// Cược Lẻ
					if (cuoc.le > 0) {
						if (!gameChan) {
							totall    += cuoc.le;
							TongThang += cuoc.le*1.98;
						}else{
							totall    -= cuoc.le;
						}
					}
					// 3 đỏ
					if (cuoc.red3 > 0) {
						if (red3) {
							totall    += cuoc.red3*3;
							TongThang += cuoc.red3*3.94;
						}else{
							totall    -= cuoc.red3;
						}
					}
					// 4 đỏ
					if (cuoc.red4 > 0) {
						if (red4) {
							totall    += cuoc.red4*10;
							TongThang += cuoc.red4*14.7;
						}else{
							totall    -= cuoc.red4;
						}
					}
					// 3 trắng
					if (cuoc.white3 > 0) {
						if (white3) {
							totall    += cuoc.white3*3;
							TongThang += cuoc.white3*3.94;
						}else{
							totall    -= cuoc.white3;
						}
					}
					// 4 trắng
					if (cuoc.white4 > 0) {
						if (white4) {
							totall    += cuoc.white4*10;
							TongThang += cuoc.white4*14.7;
						}else{
							totall    -= cuoc.white4;
						}
					}
					let update     = {};
					let updateGame = {};
					cuoc.thanhtoan = true;
					cuoc.betwin    = TongThang;
					cuoc.save();
					update['totall']     = totall;
					updateGame['totall'] = totall;
					if (TongThang > 0) {
						update['red'] = TongThang;
					}
					if (totall > 0) {
						update['redWin'] = updateGame['win'] = totall;
					}
					if (totall < 0) {
						update['redLost'] = updateGame['lost'] = totall*-1;
					}
					update['redPlay'] = updateGame['bet'] = tongDat;
					!cuoc.bot && UserInfo.updateOne({id:cuoc.uid}, {$inc:update}).exec();
					XocXoc_user.updateOne({uid:cuoc.uid}, {$inc:updateGame}).exec();
					if(void 0 !== this.clients[cuoc.uid]){
						let status = {};
						if (TongThang > 0) {
							status = {xocxoc:{status:{win:true, bet:TongThang}}};
						}else{
							status = {xocxoc:{status:{win:false, bet:Math.abs(totall)}}};
						}
						this.clients[cuoc.uid].red(status);
						status = null;
					}
					TongThang  = null;
					tongDat    = null;
					update     = null;
					updateGame = null;
					return {users:cuoc.name, bet:totall};
				}.bind(this)))
				.then(function(arrayOfResults) {
					gameChan = null;
					phien = null;
					dice = null;
					red3   = null;
					red4   = null;
					white3 = null;
					white4 = null;
					arrayOfResults = arrayOfResults.filter(function(st){
						return st.bet > 10000;
					});
					this.play();
					if (arrayOfResults.length) {
						arrayOfResults.sort(function(a, b){
							return b.bet-a.bet;
						});

						arrayOfResults = arrayOfResults.slice(0, 10);
						arrayOfResults = Helpers.shuffle(arrayOfResults);

						Promise.all(arrayOfResults.map(function(obj){
							return {users:obj.users, bet:obj.bet, game:'Xóc Xóc'};
						}))
						.then(results => {
							this.io.sendInHome({news:{a:results}});
							results = null;
							arrayOfResults = null;
						});
					}
				}.bind(this));
			}else{
				gameChan = null;
				phien = null;
				dice = null;
				red3   = null;
				red4   = null;
				white3 = null;
				white4 = null;

				this.play();
			}
		}.bind(this));
	}else{
		Object.values(this.clients).forEach(function(client){
			client.red({xocxoc:{client:this.data}});
		}.bind(this));

		///**
		let admin_data = {xocxoc:{info:this.dataAdmin, ingame:this.ingame}};
		Object.values(this.io.admins).forEach(function(admin){
			admin.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewXocXoc !== void 0 && client.gameEvent.viewXocXoc){
					client.red(admin_data);
				}
			});
		});
		//*/
	}
}

XocXoc.prototype.resetData = function(){
	this.data.red.chan =   0;
	this.data.red.le =     0;
	this.data.red.red3 =   0;
	this.data.red.red4 =   0;
	this.data.red.white3 = 0;
	this.data.red.white4 = 0;

	this.chip.chan['1000']    = 0;
	this.chip.chan['10000']   = 0;
	this.chip.chan['50000']   = 0;
	this.chip.chan['100000']  = 0;
	this.chip.chan['1000000'] = 0;

	this.chip.le['1000']    = 0;
	this.chip.le['10000']   = 0;
	this.chip.le['50000']   = 0;
	this.chip.le['100000']  = 0;
	this.chip.le['1000000'] = 0;

	this.chip.red3['1000']    = 0;
	this.chip.red3['10000']   = 0;
	this.chip.red3['50000']   = 0;
	this.chip.red3['100000']  = 0;
	this.chip.red3['1000000'] = 0;

	this.chip.red4['1000']    = 0;
	this.chip.red4['10000']   = 0;
	this.chip.red4['50000']   = 0;
	this.chip.red4['100000']  = 0;
	this.chip.red4['1000000'] = 0;

	this.chip.white3['1000']    = 0;
	this.chip.white3['10000']   = 0;
	this.chip.white3['50000']   = 0;
	this.chip.white3['100000']  = 0;
	this.chip.white3['1000000'] = 0;

	this.chip.white4['1000']    = 0;
	this.chip.white4['10000']   = 0;
	this.chip.white4['50000']   = 0;
	this.chip.white4['100000']  = 0;
	this.chip.white4['1000000'] = 0;
};

XocXoc.prototype.resetDataAdmin = function(){
	this.ingame.red = {};
	this.dataAdmin.red.chan =   0;
	this.dataAdmin.red.le =     0;
	this.dataAdmin.red.red3 =   0;
	this.dataAdmin.red.red4 =   0;
	this.dataAdmin.red.white3 = 0;
	this.dataAdmin.red.white4 = 0;
};

XocXoc.prototype.randomChip = function(){
	let a = (Math.random()*35)>>0;
	if (a == 34) {
		return 1000;
	}else if (a >= 30 && a < 34) {
		return 10000;
	}else if (a >= 25 && a < 30) {
		return 100000;
	}else if (a >= 18 && a < 25) {
		return 1000000;
	}else{
		return 50000;
	}
}

XocXoc.prototype.randomBox = function(){
	let a = Math.floor(Math.random()*38);
	if (a >= 0 && a < 10) {
		return 'chan';
	}else if (a >= 10 && a < 20) {
		return 'le';
	}else if (a >= 20 && a < 26) {
		return 'red3';
	}else if (a >= 26 && a < 32) {
		return 'white3';
	}else if (a >= 32 && a < 35) {
		return 'red4';
	}else if (a >= 35 && a < 38) {
		return 'white4';
	}
}

XocXoc.prototype.randomTime = function(){
	return Math.floor(Math.random()*5000);
}

XocXoc.prototype.bot = function(data){
	let chip = this.randomChip();
	switch(chip){
		case 1000:
			var rand = Math.floor(Math.random()*(5-5+1))+5;
			for (let i = rand; i >= 0; i--) {
				this.botCuoc(chip, data);
			}
			break;
		case 10000:
			var rand = Math.floor(Math.random()*(5-2+1))+2;
			for (let i = rand; i >= 0; i--) {
				this.botCuoc(chip, data);
			}
			break;
		case 50000:
			var rand = Math.floor(Math.random()*(3-1+1))+1;
			for (let i = rand; i >= 0; i--) {
				this.botCuoc(chip, data);
			}
			break;
		case 100000:
			var rand = Math.floor(Math.random()*(5-1+1))+1;
			for (let i = rand; i >= 0; i--) {
				this.botCuoc(chip, data);
			}
			break;
		case 1000000:
			var rand = Math.floor(Math.random()*(2-1+1))+1;
			for (let i = rand; i >= 0; i--) {
				this.botCuoc(chip, data);
			}
			break;
	}
}

XocXoc.prototype.botCuoc = function(cuoc, data){
	let time = this.randomTime();
	setTimeout(function(){
		let box = this.randomBox();
		let temp_c = cuoc;
		XocXoc_cuoc.findOne({uid:data.id, phien:this.phien}, function(err, checkOne){
			if (checkOne){
				checkOne[box] += temp_c;
				checkOne.save();
			}else{
				var create = {uid:data.id, bot:true, name:data.name, phien:this.phien, time:new Date()};
				create[box] = temp_c;
			//	XocXoc_cuoc.create(create);
			}
			data = null;
			temp_c = null;
		}.bind(this));
		this.data.red[box] += cuoc;
		Object.values(this.clients).forEach(function(users){
			users.red({xocxoc:{chip:{box:box, cuoc:cuoc}}});
		});
		cuoc = null;
	}.bind(this), time);
}

module.exports = XocXoc;
