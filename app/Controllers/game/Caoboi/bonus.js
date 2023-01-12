
let HU            = require('../../../Models/HU');
let Caoboi_red  = require('../../../Models/LichSu_Cuoc');
let Caoboi_user = require('../../../Models/Caoboi/Caoboi_user');
let UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.Caoboi &&
		client.Caoboi.bonus !== null &&
		client.Caoboi.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.Caoboi.bonus[index]) {
			if (!client.Caoboi.bonus[index].isOpen) {
				client.Caoboi.bonusL -= 1;
				client.Caoboi.bonus[index].isOpen = true;

				var bet = client.Caoboi.bonus[index].bet;
				client.Caoboi.bonusWin += bet;
				client.red({Caoboi:{bonus:{bonus: client.Caoboi.bonusL, box: index, bet: bet}}});
				if (!client.Caoboi.bonusL) {
					var betWin = client.Caoboi.bonusWin;
					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};
						huUpdate.redWin = betWin;
						uInfo.red       = betWin;
						uInfo.redWin    = betWin;
						gInfo.win       = betWin;
						Caoboi_red.updateOne({'_id': client.Caoboi.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();
					}
					client.Caoboi.bonus    = null;
					client.Caoboi.bonusWin = 0;
					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
								client.red({Caoboi:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
						}, 700);
					});
					HU.updateOne({game:'Caoboi', type:client.Caoboi.bet}, {$inc:huUpdate}).exec();
					Caoboi_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
				}
			}
		}
	}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
