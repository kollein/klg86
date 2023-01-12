
let HU                 = require('../../../Models/HU');

const RoyAl_red  = require('../../../Models/LichSu_Cuoc');
const RoyAl_xu   = require('../../../Models/RoyAl/RoyAl_xu');
const RoyAl_user = require('../../../Models/RoyAl/RoyAl_user');

let UserInfo           = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.RoyAl &&
		client.RoyAl.bonus !== null &&
		client.RoyAl.bonusL > 0)
	{
		let index = box-1;
		if (void 0 !== client.RoyAl.bonus[index]) {
			if (!client.RoyAl.bonus[index].isOpen) {
				client.RoyAl.bonusL -= 1;
				client.RoyAl.bonus[index].isOpen = true;

				let bet = client.RoyAl.bonus[index].bet;
				client.RoyAl.bonusWin += bet;
				client.red({VuoRoyAlngQuocRed:{bonus:{bonus: client.RoyAl.bonusL, box: index, bet: bet}}});
				if (!client.RoyAl.bonusL) {
					let betWin = client.RoyAl.bonusWin*client.RoyAl.bonusX;

					let uInfo    = {};
					let gInfo    = {};
					let huUpdate = {};

					if (client.RoyAl.red) {
						huUpdate.redWin = betWin;
						uInfo.red       = betWin;
						uInfo.redWin    = betWin;
						gInfo.win       = betWin;
						RoyAl_red.updateOne({'_id': client.RoyAl.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();
					}else{
						huUpdate.xuWin = betWin;
						uInfo.xu       = betWin;
						uInfo.xuWin    = betWin;
						gInfo.winXu    = betWin;

						let thuong = (betWin*0.039589)>>0;
						uInfo.red      = thuong;
						uInfo.thuong   = thuong;
						gInfo.thuong   = thuong;

						RoyAl_xu.updateOne({'_id': client.RoyAl.id}, {$inc:{win:betWin}}).exec();
					}

					client.RoyAl.bonus    = null;
					client.RoyAl.bonusWin = 0;
					client.RoyAl.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							if (client.RoyAl.red) {
								client.red({royal:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							}else{
								client.red({royal:{bonus:{win: betWin}}, user:{xu:user.xu*1+betWin}});
							}
							client = null;
						}, 700);
					});
					HU.updateOne({game:'roy', type:client.RoyAl.bet, red:client.RoyAl.red}, {$inc:huUpdate}).exec();
					RoyAl_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
