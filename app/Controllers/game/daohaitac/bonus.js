
let HU         = require('../../../Models/HU');

let Daohaitac_red  = require('../../../Models/Daohaitac/Daohaitac_red');
let Daohaitac_user = require('../../../Models/Daohaitac/Daohaitac_user');

let UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.Daohaitac &&
		client.Daohaitac.bonus !== null &&
		client.Daohaitac.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.Daohaitac.bonus[index]) {
			if (!client.Daohaitac.bonus[index].isOpen) {
				client.Daohaitac.bonusL -= 1;
				client.Daohaitac.bonus[index].isOpen = true;

				var bet = client.Daohaitac.bonus[index].bet;
				client.Daohaitac.bonusWin += bet;
				client.red({Daohaitac:{bonus:{bonus: client.Daohaitac.bonusL, box: index, bet: bet}}});
				if (!client.Daohaitac.bonusL) {
					var betWin = client.Daohaitac.bonusWin*client.Daohaitac.bonusX;

					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};

					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;

					gInfo.win       = betWin;
					gInfo.totall    = betWin;
					Daohaitac_red.updateOne({'_id': client.Daohaitac.id}, {$inc:{win:betWin}}).exec();

					client.Daohaitac.bonus    = null;
					client.Daohaitac.bonusWin = 0;
					client.Daohaitac.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({Daohaitac:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
						}, 700);
					});
					HU.updateOne({game:'Daohaitac', type:client.Daohaitac.bet}, {$inc:huUpdate}).exec();
					Daohaitac_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
