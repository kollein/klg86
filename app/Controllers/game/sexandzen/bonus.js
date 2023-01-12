
let HU         = require('../../../Models/HU');

let Sexandzen_red  = require('../../../Models/LichSu_Cuoc');
let Sexandzen_user = require('../../../Models/Sexandzen/Sexandzen_user');

let UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.Sexandzen &&
		client.Sexandzen.bonus !== null &&
		client.Sexandzen.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.Sexandzen.bonus[index]) {
			if (!client.Sexandzen.bonus[index].isOpen) {
				client.Sexandzen.bonusL -= 1;
				client.Sexandzen.bonus[index].isOpen = true;

				var bet = client.Sexandzen.bonus[index].bet;
				client.Sexandzen.bonusWin += bet;
				client.red({sexandzen:{bonus:{bonus: client.Sexandzen.bonusL, box: index, bet: bet}}});
				if (!client.Sexandzen.bonusL) {
					var betWin = client.Sexandzen.bonusWin*client.Sexandzen.bonusX;

					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};

					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;

					gInfo.win       = betWin;
					gInfo.totall    = betWin;
					Sexandzen_red.updateOne({'_id': client.Sexandzen.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();

					client.Sexandzen.bonus    = null;
					client.Sexandzen.bonusWin = 0;
					client.Sexandzen.bonusX   = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({sexandzen:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
						}, 700);
					});
					HU.updateOne({game:'sexandzen', type:client.Sexandzen.bet}, {$inc:huUpdate}).exec();
					Sexandzen_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
