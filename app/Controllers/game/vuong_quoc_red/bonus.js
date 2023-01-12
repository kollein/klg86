
let HU                 = require('../../../Models/HU');
let VuongQuocRed_red   = require('../../../Models/LichSu_Cuoc');
let VuongQuocRed_users = require('../../../Models/VuongQuocRed/VuongQuocRed_users');
let UserInfo           = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.VuongQuocRed &&
		client.VuongQuocRed.bonus !== null &&
		client.VuongQuocRed.bonusL > 0)
	{
		let index = box-1;
		if (void 0 !== client.VuongQuocRed.bonus[index]) {
			if (!client.VuongQuocRed.bonus[index].isOpen) {
				client.VuongQuocRed.bonusL -= 1;
				client.VuongQuocRed.bonus[index].isOpen = true;
				let bet = client.VuongQuocRed.bonus[index].bet;
				client.VuongQuocRed.bonusWin += bet;
				client.red({VuongQuocRed:{bonus:{bonus: client.VuongQuocRed.bonusL, box: index, bet: bet}}});
				if (!client.VuongQuocRed.bonusL) {
					let betWin = client.VuongQuocRed.bonusWin*client.VuongQuocRed.bonusX;

					let uInfo    = {};
					let gInfo    = {};
					let huUpdate = {};

					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;
					gInfo.win       = betWin;
					gInfo.totall    = betWin;

					VuongQuocRed_red.updateOne({'_id': client.VuongQuocRed.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();

					client.VuongQuocRed.bonus    = null;
					client.VuongQuocRed.bonusWin = 0;
					client.VuongQuocRed.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({VuongQuocRed:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							client = null;
						}, 700);
					});
					HU.updateOne({game:'vuongquocred', type:client.VuongQuocRed.bet}, {$inc:huUpdate}).exec();
					VuongQuocRed_users.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
