
var TXPhien     = require('../../Models/TaiXiu_phien');
var TXCuoc      = require('../../Models/TaiXiu_cuoc');
var TXChat      = require('../../Models/TaiXiu_chat');
var TaiXiu_User = require('../../Models/TaiXiu_user');
var TXCuocOne   = require('../../Models/TaiXiu_one');
var HUTX        = require('../../Models/HUTX');
var LScuoc        = require('../../Models/LichSu_Cuoc');
var DaiLy = require('../../Models/DaiLy');
var UserInfo    = require('../../Models/UserInfo');
let TopVip      = require('../../Models/VipPoint/TopVip');
var validator   = require('validator');

function getindex(arrray , name){
	for(let i =0 ; i < arrray.length ; i++){
		if(arrray[i].name == name){
			return i+1;	
		}
	}
	return 0;
}
function getLogs(client){
	var data = JSON.parse(JSON.stringify(client.redT.taixiu));
	data.taixiu.red_me_tai = 0;
	data.taixiu.red_me_xiu = 0;
	var active1 = new Promise((resolve, reject) => {
		TXPhien.find({}, {}, {sort:{'_id':-1}, limit:125}, function(err, post) {
			Promise.all(post.map(function(obj){return {'dice':[obj.dice1,obj.dice2,obj.dice3], 'phien':obj.id}}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
	});

	var active2 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid:client.UID}, 'tLineWinRed tLineLostRed tLineWinRedH tLineLostRedH', function(err, data_a2) {
			data_a2 = data_a2._doc;
			delete data_a2._id;
			resolve(data_a2);
		});
	});

	client.redT.taixiuAdmin.list.forEach(function(game){
		if (game.name == client.profile.name) {
			if (game.select) {
				data.taixiu.red_me_tai += game.bet;
			}else{
				data.taixiu.red_me_xiu += game.bet;
			}
		}
	});
	Promise.all([active1, active2])
	.then(values => {
		data.logs   = values[0];
		data.du_day = values[1];
		client.red({taixiu:data});
		data = null;
		client = null;
	});
}

function getNew(client){
	var active1 = new Promise((resolve, reject) => {
		UserInfo.findOne({id:client.UID}, 'red', function(err, user){
			if (err) return reject(err)
			resolve(user)
		});
	});
	var active2 = new Promise((resolve, reject) => {
		TaiXiu_User.findOne({uid:client.UID}, 'tLineWinRed tLineLostRed tLineWinRedH tLineLostRedH', function(err, data) {
			if (err) return reject(err)
			resolve(data)
		});
	});

	Promise.all([active1, active2]).then(values => {
		client.red({user:values[0], taixiu:{du_day:values[1]}});
		client = null;
	});
}


var chat = function(client, str){
	Chat = setInterval(function(){
	if (!!str) {
		UserInfo.findOne({id:client.UID}, 'red name', function(err, user){
			var tentk = user.name;
           if (!user || user.red < 10000) {
			
				//client.red({taixiu:{err:'Tài khoản phải có ít nhất 10.000 Gold để chat.!!'}});
				client.red({taixiu:{chat:{message:{user:'***Số dư không đủ để chát***', value:'!'}}}});
				client = null;
				str = null;
			}else{
	
                   
					TXChat.findOne({}, 'uid value', {sort:{'_id':-1}}, function(err, post) {
							if (!post || post.uid != client.UID || (post.uid == client.UID && post.value != str)) {
								TXChat.create({'uid':client.UID, 'name':client.profile.name, 'value':str});
								let top = getindex(client.redT.listTop,client.profile.name);
						
						Object.values(client.redT.users).forEach(function(users){
							users.forEach(function(client){
								client.red({taixiu:{chat:{message:{user: tentk, value: str, top : top}}}});
								//var content = { taixiu: { chat: { message: { user: client.profile.name, value: str, top : top } } } };
								//client.red(content);
							});
						});
							}
							str = null;
							client = null;
						});
		
		 

	
			}
});
	}
	},1000);
	return Chat;
	
}


var cuoc = function(client, data){
	if (!!data && !!data.bet) {
			
		if (client.redT.TaiXiu_time < 3 || client.redT.TaiXiu_time > 64) { // đang 60s mà em chua tính trả thưởng
			client.red({taixiu:{err:'Phiên mới chưa bắt đầu !'}});
		}else{
			let bet    = data.bet>>0;   // Số tiền
			let select = !!data.select; // Cửa đặt (Tài:1, Xỉu:0)
			if (bet < 1000){
				client.red({taixiu:{err:'Số tiền cược thấp nhất 1k !'}});
			}else if (bet > 999999999){
				client.red({taixiu:{err:'Số tiền cược tối đa 999.999.999k !!'}});
			}else if (bet < 0){
				client.red({taixiu:{err:'Cảnh báo TK sắp bị khóa vĩnh viễn !!'}});
			}else{
				UserInfo.findOne({id:client.UID}, 'red name', function(err, user){
					if (user === null || user.red < bet) {
						client.red({taixiu:{err:'Bạn không đủ số dư !'}});
					}else{
                     DaiLy.findOne({nickname:user.name},function(err,userDl){ if(userDl){
                      client.red({
                       notice: {
                        title: 'Thông Báo',
                        text: 'Đại lý không được chơi game',
                        load: false
                       }
                      });
                     }else{
						 
						
						let phien = client.redT.TaiXiu_phien;
						
						TXCuocOne.findOne({uid:client.UID, phien:phien}, 'bet phien select', function(isCuocErr, isCuoc) {
							if (!!isCuoc) {
								// update
								if (isCuoc.select !== select) {
									client.red({taixiu:{err:'Chỉ được cược 1 bên.!!'}});
								}else{
									user.red -= bet;
						            user.save();
									client.red({taixiu:{err:'Đặt cược thành công!'}});
									client.red({taixiu:{amthanhdatcuoc:1}});
									isCuoc.bet = isCuoc.bet*1+bet;
									isCuoc.save();
									var io = client.redT;
									if (select) {
										io.taixiu.taixiu.red_tai      += bet;
										io.taixiuAdmin.taixiu.red_tai += bet;
										io.taixiu.taixiu.red_player_tai += 1;
										io.taixiu.taixiu.phien = phien;
									}else{
										io.taixiu.taixiu.red_xiu      += bet;
										io.taixiuAdmin.taixiu.red_xiu += bet;
										io.taixiu.taixiu.red_player_xiu  += 1;
										io.taixiu.taixiu.phien = phien;
									}
									io.taixiuAdmin.list.unshift({name:user.name, select:select, bet:bet, time:new Date()});
									io = null;
									TXCuoc.create({uid:client.UID, name:user.name, phien:phien, bet:bet, select:select, time:new Date()});
									LScuoc.updateOne({uid:client.UID, phien:phien}, {$set:{tienhienco:user.red}, $inc:{bet:bet}}).exec();
                                    // LScuoc.updateOne({uid:client.UID, phien:phien, select:select, bet:isCuoc.bet});
								   // LScuoc.create({uid:client.UID, name:user.name, game:'Tài Xỉu MD5', phien:phien, select:select, tiencuoc:bet, chitiet:'Đặt Cược Phiên'+phien, tienthang:'0', tienhienco:user.red, time:new Date()});
									var taixiuVery = select ? {red_me_tai:isCuoc.bet} : {red_me_xiu:isCuoc.bet};
									taixiuVery = {taixiu:taixiuVery};
									if (!!client.redT.users[client.UID]) {
										client.redT.users[client.UID].forEach(function(obj){
											obj.red({taixiu:taixiuVery, user:{red:user.red}});
										});
									}
								}
							}else{
								
								// cuoc
								user.red -= bet;
						        user.save();
								var io = client.redT;
								if (select) {
									io.taixiu.taixiu.red_tai             += bet;
									io.taixiu.taixiu.red_player_tai      += 1;
									io.taixiuAdmin.taixiu.red_tai        += bet;
									io.taixiuAdmin.taixiu.red_player_tai += 1;
								}else{
									io.taixiu.taixiu.red_xiu             += bet;
									io.taixiu.taixiu.red_player_xiu      += 1;

									io.taixiuAdmin.taixiu.red_xiu        += bet;
									io.taixiuAdmin.taixiu.red_player_xiu += 1;
								}
								io.taixiuAdmin.list.unshift({name:user.name, select:select, bet:bet, time:new Date()});
								io = null;
								client.red({taixiu:{err:'Đặt cược thành công!'}});
								client.red({taixiu:{amthanhdatcuoc:1}});
								TXCuocOne.create({uid:client.UID, phien:phien, select:select, bet:bet});
								TXCuoc.create({uid:client.UID, name:user.name, phien:phien, bet:bet, select:select, time:new Date()});
								LScuoc.create({uid:client.UID, phien:phien, select:select, bet:bet, thanhtoan:0, tienhienco:user.red, dichvu:'Tài Xỉu MD5', time:new Date()});
								var taixiuVery = select ? {red_me_tai:bet} : {red_me_xiu:bet};
								taixiuVery = {taixiu:taixiuVery};

								if (!!client.redT.users[client.UID]) {
									client.redT.users[client.UID].forEach(function(obj){
										obj.red({taixiu:taixiuVery, user:{red:user.red}});
									});
								}
								
							}
							bet    = null;
							select = null;
							phien  = null;
							client = null;
							user   = null;
						});
					}
					 });
					
					}
				});
			}
		}
			}
}	
var getuser_play = function(client, data){
	if (!!data && !!data.phien) {
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
			}
		});
	}
	
}
var get_nohutxv = function(client, data){
	if (!!data && !!data.phien) {
		console.log(data);
		var phien  = data.phien>>0;
		var getPhien = TXPhien.findOne({id:phien}).exec();
		//var getCuoc  = TXCuoc.find({phien:phien, taixiu:true, red:true}, null, {sort:{'_id':1}}).exec();
		var getCuoc  = HUTX.find({phien:phien}, null).exec();

		var tong_L        = 0;
		var tong_R        = 0;
		var tong_tralai_L = 0;
		var tong_tralai_R = 0;
		var gettonguser_left = 0;
		var gettonguser_right = 0;

		Promise.all([getPhien, getCuoc]).then(values => {
			if (!!values[0]) {
				let infoPhienCuoc = values[0];
				let phienCuoc     = values[1];
				let dataT = {};
				dataT['phien'] = phien;
				dataT['md5tx'] = infoPhienCuoc.md5tx;
				dataT['md5hash'] = infoPhienCuoc.md5hash;
				dataT['time']  = infoPhienCuoc.time;
				dataT['dice']  = [infoPhienCuoc.dice1, infoPhienCuoc.dice2, infoPhienCuoc.dice3];
				var dataL = new Promise((resolve, reject) => {
					Promise.all(phienCuoc.filter(function(obj){
						name = obj.name
						nhan = obj.nhan
						tongtiendat = obj.tongtiendat

					}))
					.then(function(arrayOfResults) {
						resolve(arrayOfResults)
					})
				});
				Promise.all([dataL]).then(result => {
					dataT['name']        = name;
					dataT['nhan']        = nhan;
					dataT['tongtiendat'] = tongtiendat;
					dataT['dataL'] = result[0];
					client.red({taixiu:{get_nohutxv:dataT}});

					infoPhienCuoc = null;
					phienCuoc     = null;
					dataT  = null;
					phien  = null;
					getPhien = null;
					//getCuoc  = null;
					getCuoc  = null;
					name = null;
					nhan  = null;
					tongtiendat = null;
					client = null;
				});
			}else{
				client.red({notice:{title:'LỖI', text:'Phiên không tồn tại...', load:false}});
				phien  = null;
				getPhien = null;
				//getCuoc  = null;
				getCuoc  = null;
				name = null;
					nhan  = null;
					tongtiendat = null;
					client = null;
			}
		});
	}
}
var get_jackpot = async function(client, data){
	TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
	if (!!last){
		getphien = last.id+1;
	}
	TXPhien.findOne({phien:getphien}, 'jackpot', function(err, data){
				var getjackpot = data.jackpot;
				let home;
			home = {taixiu: {isjackpot:getjackpot}};

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
	})
}
var get_phien = function(client, data){
	if (!!data && !!data.phien) {
		var phien  = data.phien>>0;
		var getPhien = TXPhien.findOne({id:phien}).exec();
		//var getCuoc  = TXCuoc.find({phien:phien, taixiu:true, red:true}, null, {sort:{'_id':1}}).exec();
		var getCuoc  = TXCuoc.find({phien:phien}, null).exec();

		var tong_L        = 0;
		var tong_R        = 0;
		var tong_tralai_L = 0;
		var tong_tralai_R = 0;
		var gettonguser_left = 0;
		var gettonguser_right = 0;

		Promise.all([getPhien, getCuoc]).then(values => {
			if (!!values[0]) {
				let infoPhienCuoc = values[0];
				let phienCuoc     = values[1];
				let dataT = {};
				dataT['phien'] = phien;
				dataT['md5tx'] = infoPhienCuoc.md5tx;
				dataT['md5hash'] = infoPhienCuoc.md5hash;
				dataT['time']  = infoPhienCuoc.time;
				dataT['dice']  = [infoPhienCuoc.dice1, infoPhienCuoc.dice2, infoPhienCuoc.dice3];
				var dataL = new Promise((resolve, reject) => {
					Promise.all(phienCuoc.filter(function(obj){
						if(obj.select){
							tong_L += obj.bet
							gettonguser_left += obj.phien
							tong_tralai_L += obj.tralai
						} else {
							tong_R += obj.bet
							gettonguser_right += obj.phien
							tong_tralai_R += obj.tralai
						}
						return obj.select == 1
					}))
					.then(function(arrayOfResults) {
						resolve(arrayOfResults)
					})
				});
				var dataR = new Promise((resolve, reject) => {
					Promise.all(phienCuoc.filter(function(obj){
						return obj.select == 0
					}))
					.then(function(arrayOfResults) {
						resolve(arrayOfResults)
					})
				});
				Promise.all([dataL, dataR]).then(result => {
					dataT['tong_L']        = tong_L;
					dataT['tong_R']        = tong_R;
					dataT['tong_tralai_L'] = tong_tralai_L;
					dataT['tong_tralai_R'] = tong_tralai_R;
					dataT['gettonguser_left'] = gettonguser_left;
					dataT['gettonguser_right'] = gettonguser_right;
					dataT['dataL'] = result[0];
					dataT['dataR'] = result[1];
					client.red({taixiu:{get_phien:dataT}});

					infoPhienCuoc = null;
					phienCuoc     = null;
					dataT  = null;
					phien  = null;
					getPhien = null;
					//getCuoc  = null;
					getCuoc  = null;
					tong_L        = null;
					tong_R        = null;
					gettonguser_right = null;
					gettonguser_left  = null;
					tong_tralai_L = null;
					tong_tralai_R = null;
					client = null;
				});
			}else{
				client.red({notice:{title:'LỖI', text:'Phiên không tồn tại...', load:false}});
				phien  = null;
				getPhien = null;
				//getCuoc  = null;
				getCuoc  = null;
				tong_L        = null;
				tong_R        = null;
				gettonguser_right = null;
				gettonguser_left = null;
				tong_tralai_L = null;
				tong_tralai_R = null;
				client = null;
			}
		});
	}
}
var get_nohutx = async function(client, data){
	console.log(data);
	var phienis = data.phien;
	var gettonguser = 0;
	if (phienis == 0){
		HUTX.findOne({}, 'phiennohu', {sort:{'phiennohu':-1}}, function(err, last) {
	if (!!last){
		var getphienhu = last.phiennohu;
	}

		
		HUTX.find({phiennohu:getphienhu}, {}, {sort:{'nhan':-1}, limit:39}, function(err, results) {
			Promise.all(results.map(function(obj){
				return new Promise(function(resolve, reject) {
					UserInfo.findOne({'id': obj.uid}, function(error, result2){
						resolve({name:!!result2 ? result2.name : '', phiennohu: obj.phiennohu, bet:obj.nhan, phien:obj.phien, quyhu:obj.quyhu, ketqua:obj.ketqua, tonguser:obj.tonguser, time:obj.time});
					})
				})
			}))
			.then(function(result){
				client.red({profile:{get_nohutx:result, load: false}});
				client = null;
			});
		});
	});	

	}
	else{
		HUTX.find({phiennohu:phienis}, {}, {sort:{'nhan':-1}, limit:39}, function(err, results) {
			Promise.all(results.map(function(obj){
				return new Promise(function(resolve, reject) {
					UserInfo.findOne({'id': obj.uid}, function(error, result2){
						resolve({name:!!result2 ? result2.name : '', phiennohu: obj.phiennohu, bet:obj.nhan, phien:obj.phien, quyhu:obj.quyhu, ketqua:obj.ketqua, tonguser:obj.tonguser, time:obj.time});
					})
				})
			}))
			.then(function(result){
				client.red({profile:{get_nohutx:result, load: false}});
				client = null;
			});
		});
	
	
	}
	
}


var get_lichsuchoi = function(client, data){
	if (!!data && !!data.page) {
		var page  = data.page>>0;
		var kmess = 6;
		if (page > 0) {
			LScuoc.countDocuments({uid:client.UID}).exec(function(err, total){
				var getCuoc = LScuoc.find({uid:client.UID}, {}, {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							var getPhien = TXPhien.findOne({id:obj.phien}).exec();
							return Promise.all([getPhien]).then(values => {
								Object.assign(obj, values[0]._doc);
								delete obj.__v;
								delete obj._id;
								//delete obj.lenh;
								delete obj.id;
								delete obj.uid;
								return obj;
							});
						}))
						.then(function(arrayOfResults) {
							client.red({taixiu:{get_lichsuchoi:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
							client = null;
							kmess = null;
							page = null;
							total = null;
						});
					}else{
						client.red({taixiu:{get_lichsuchoi:{data:[], page:page, kmess:6, total:0}}});
						page = null;
						client = null;
						kmess = null;
					}
				});
			});
		}
	}
}

var get_log = function(client, data){
	if (!!data && !!data.page) {
		var page  = data.page>>0;
		var kmess = 9;
		if (page > 0) {
			TXCuoc.countDocuments({uid:client.UID, thanhtoan:true}).exec(function(err, total){
				var getCuoc = TXCuoc.find({uid:client.UID, thanhtoan:true}, {}, {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							var getPhien = TXPhien.findOne({id:obj.phien}).exec();
							return Promise.all([getPhien]).then(values => {
								Object.assign(obj, values[0]._doc);
								delete obj.__v;
								delete obj._id;
								delete obj.thanhtoan;
								delete obj.id;
								delete obj.uid;
								return obj;
							});
						}))
						.then(function(arrayOfResults) {
							client.red({taixiu:{get_log:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
							client = null;
							kmess = null;
							page = null;
							total = null;
						});
					}else{
						client.red({taixiu:{get_log:{data:[], page:page, kmess:9, total:0}}});
						page = null;
						client = null;
						kmess = null;
					}
				});
			});
		}
	}
}
var get_top = async function(client, data){
	if (!!data) {
		//HUTX.find({}, 'nhan uid', {sort:{nhan:-1}, limit:10}, function(err, results) {
		TaiXiu_User.find({'totall':{$gt:0}}, 'totall uid', {sort:{totall:-1}, limit:20}, function(err, results) {
			Promise.all(results.map(function(obj){
				return new Promise(function(resolve, reject) {
					UserInfo.findOne({'id': obj.uid}, function(error, result2){
						resolve({name:!!result2 ? result2.name : '', bet:obj.totall});
					})
				})
			}))
			.then(function(result){
				client.red({taixiu:{get_top:result}});
				client = null;
			});
		});
	}else{
		client = null;
	}
}
var getcopy = function(client, data){
	if (!!data){
		if (data.cp == 1){
				client.red({taixiu:{err:'Đã copy chuỗi md5.'}});
			}
			else{
				client.red({taixiu:{err:'Đã copy chuỗi kết quả.'}});
			}
	}
}
module.exports = {
	getLogs:  getLogs,
	chat:     chat,
	cuoc:     cuoc,
	get_phien:get_phien,
	get_log:  get_log,
	get_top:  get_top,
	getcopy:  getcopy,
	get_nohutx:   get_nohutx,
	getNew:   getNew,
	get_nohutxv: get_nohutxv,
	get_lichsuchoi:  get_lichsuchoi,
	getuser_play: getuser_play,
}
