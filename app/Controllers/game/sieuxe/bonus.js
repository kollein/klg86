
let HU                 = require('../../../Models/HU');

const SieuXe_red  = require('../../../Models/LichSu_Cuoc');
const SieuXe_xu   = require('../../../Models/SieuXe/SieuXe_xu');
const SieuXe_user = require('../../../Models/SieuXe/SieuXe_user');

let UserInfo           = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.SieuXe &&
		client.SieuXe.bonus !== null &&
		client.SieuXe.bonusL > 0)
	{
		let index = box-1;
		if (void 0 !== client.SieuXe.bonus[index]) {
			if (!client.SieuXe.bonus[index].isOpen) {
				client.SieuXe.bonusL -= 1;
				client.SieuXe.bonus[index].isOpen = true;

				let bet = client.SieuXe.bonus[index].bet;
				client.SieuXe.bonusWin += bet;
				client.red({VuoSieuXengQuocRed:{bonus:{bonus: client.SieuXe.bonusL, box: index, bet: bet}}});
				if (!client.SieuXe.bonusL) {
					let betWin = client.SieuXe.bonusWin*client.SieuXe.bonusX;

					let uInfo    = {};
					let gInfo    = {};
					let huUpdate = {};

					if (client.SieuXe.red) {
						huUpdate.redWin = betWin;
						uInfo.red       = betWin;
						uInfo.redWin    = betWin;
						gInfo.win       = betWin;
						SieuXe_red.updateOne({'_id': client.SieuXe.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();
					}else{
						huUpdate.xuWin = betWin;
						uInfo.xu       = betWin;
						uInfo.xuWin    = betWin;
						gInfo.winXu    = betWin;

						let thuong = (betWin*0.039589)>>0;
						uInfo.red      = thuong;
						uInfo.thuong   = thuong;
						gInfo.thuong   = thuong;

						SieuXe_xu.updateOne({'_id': client.SieuXe.id}, {$inc:{win:betWin}}).exec();
					}

					client.SieuXe.bonus    = null;
					client.SieuXe.bonusWin = 0;
					client.SieuXe.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							if (client.SieuXe.red) {
								client.red({sieuxe:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							}else{
								client.red({sieuxe:{bonus:{win: betWin}}, user:{xu:user.xu*1+betWin}});
							}
							client = null;
						}, 700);
					});
					HU.updateOne({game:'sieu', type:client.SieuXe.bet, red:client.SieuXe.red}, {$inc:huUpdate}).exec();
					SieuXe_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
