
var BauCua_cuoc = require('../../../Models/LichSu_Cuoc');
var UserInfo    = require('../../../Models/UserInfo');
let TopVip      = require('../../../Models/VipPoint/TopVip');
let getConfig   = require('../../../Helpers/Helpers').getConfig;
var LScuoc        = require('../../../Models/LichSu_Cuoc');
module.exports = function(client, data){
	if (!!data && !!data.cuoc) {
		var cuoc    = data.cuoc>>0;
		var linhVat = data.linhVat>>0;
		if (client.redT.BauCua_time < 2 || client.redT.BauCua_time > 60) {
			client.red({mini:{baucua:{notice: 'Vui lòng cược ở phiên sau.!!'}}});
			return;
		}
		if (cuoc < 1000 || linhVat < 0 || linhVat > 5) {
			client.red({mini:{baucua:{notice: 'Cược thất bại...'}}});
		}else{
			UserInfo.findOne({id: client.UID}, 'red', function(err, user){
				if (!user || user.red < cuoc) {
					client.red({mini:{baucua:{notice: 'Bạn không đủ số dư'}}});
				}else{
					user.red -= cuoc;
					user.save();
					var dataRed = [
						'meRedHuou',
						'meRedBau',
						'meRedGa',
						'meRedCa',
						'meRedCua',
						'meRedTom',
					]
					var data = {};
					BauCua_cuoc.findOne({uid:client.UID, phien:client.redT.BauCua_phien}, function(err, checkOne) {
						var io = client.redT;
							if (linhVat == 0) {
								io.baucua.info.redHuou += cuoc;
								io.baucua.infoAdmin.redHuou += cuoc;
							}else if (linhVat == 1) {
								io.baucua.info.redBau += cuoc;
								io.baucua.infoAdmin.redBau += cuoc;
							}else if (linhVat == 2) {
								io.baucua.info.redGa += cuoc;
								io.baucua.infoAdmin.redGa += cuoc;
							}else if (linhVat == 3) {
								io.baucua.info.redCa += cuoc;
								io.baucua.infoAdmin.redCa += cuoc;
							}else if (linhVat == 4) {
								io.baucua.info.redCua += cuoc;
								io.baucua.infoAdmin.redCua += cuoc;
							}else if (linhVat == 5) {
								io.baucua.info.redTom += cuoc;
								io.baucua.infoAdmin.redTom += cuoc;
							}
						if (checkOne){
							BauCua_cuoc.updateOne({uid:client.UID, dichvu:'Bầu Cua', phien:client.redT.BauCua_phien}, {$set:{tienhienco:user.red}, $inc:{bet:cuoc,lswin:-cuoc}}).exec();
							let update = {};
							update[linhVat] = cuoc;
							
							BauCua_cuoc.findOneAndUpdate({uid:client.UID, dichvu:'Bầu Cua', phien:client.redT.BauCua_phien}, {$inc:update}, function (err, cat){
								dataRed.forEach(function(o, i){
									data[o] = cat[i] + (i == linhVat ? cuoc : 0);
									return (data[o] = cat[i] + (i == linhVat ? cuoc : 0));
								});
								let dataT = {mini:{baucua:{data:data}}, user:{red:user.red}};
								client.redT.users[client.UID].forEach(function(obj){
									obj.red(dataT);
								});
							});
							io.baucua.ingame.forEach(function(uOld){
								if (uOld.uid == client.UID) {
									uOld[linhVat] += cuoc;
								}
							});
						}else{
							//LScuoc.create({'uid':client.UID, 'game':'Bầu Cua', 'betwin':-cuoc, 'bet':cuoc, tienhienco:user.red, 'phien':client.redT.BauCua_phien, 'select':1, time:new Date()});
							let create = {uid:client.UID, dichvu:'Bầu Cua', lswin:-cuoc, bet:cuoc, thanhtoan:0, name:client.profile.name, tienhienco:user.red, phien:client.redT.BauCua_phien, time: new Date()};
							create[linhVat] = cuoc;
							BauCua_cuoc.create(create);
							data[dataRed[linhVat]] = cuoc;
							let dataT = {mini:{baucua:{data: data}}, user:{red:user.red}};
							client.redT.users[client.UID].forEach(function(obj){
								obj.red(dataT);
							});
							let addList = {uid:client.UID, name:client.profile.name, '0':0, '1':0, '2':0, '3':0, '4':0, '5':0};
							addList[linhVat] = cuoc;
							io.baucua.ingame.unshift(addList);
						}
					});

					let vipStatus = getConfig('topVip');
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
				}
			});
		}
	}
};
