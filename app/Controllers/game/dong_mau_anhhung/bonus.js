
let HU                 = require('../../../Models/HU');
let DongMauAnhhung_red   = require('../../../Models/LichSu_Cuoc');
let DongMauAnhhung_users = require('../../../Models/DongMauAnhhung/DongMauAnhhung_users');
let UserInfo           = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.DongMauAnhhung &&
		client.DongMauAnhhung.bonus !== null &&
		client.DongMauAnhhung.bonusL > 0)
	{
		let index = box-1;
		if (void 0 !== client.DongMauAnhhung.bonus[index]) {
			if (!client.DongMauAnhhung.bonus[index].isOpen) {
				client.DongMauAnhhung.bonusL -= 1;
				client.DongMauAnhhung.bonus[index].isOpen = true;
				let bet = client.DongMauAnhhung.bonus[index].bet;
				client.DongMauAnhhung.bonusWin += bet;
				client.red({DongMauAnhhung:{bonus:{bonus: client.DongMauAnhhung.bonusL, box: index, bet: bet}}});
				if (!client.DongMauAnhhung.bonusL) {
					let betWin = client.DongMauAnhhung.bonusWin*client.DongMauAnhhung.bonusX;

					let uInfo    = {};
					let gInfo    = {};
					let huUpdate = {};

					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;
					gInfo.win       = betWin;
					gInfo.totall    = betWin;

					DongMauAnhhung_red.updateOne({'_id': client.DongMauAnhhung.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();

					client.DongMauAnhhung.bonus    = null;
					client.DongMauAnhhung.bonusWin = 0;
					client.DongMauAnhhung.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({DongMauAnhhung:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							client = null;
						}, 700);
					});
					HU.updateOne({game:'dongmauanhhung', type:client.DongMauAnhhung.bet}, {$inc:huUpdate}).exec();
					DongMauAnhhung_users.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
				}else{
					client = null;
				}
			}
		}
	}
}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
