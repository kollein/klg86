
let HU            = require('../../../Models/HU');
let LongLan_red  = require('../../../Models/LichSu_Cuoc');
let LongLan_user = require('../../../Models/LongLan/LongLan_user');
let UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.LongLan &&
		client.LongLan.bonus !== null &&
		client.LongLan.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.LongLan.bonus[index]) {
			if (!client.LongLan.bonus[index].isOpen) {
				client.LongLan.bonusL -= 1;
				client.LongLan.bonus[index].isOpen = true;

				var bet = client.LongLan.bonus[index].bet;
				client.LongLan.bonusWin += bet;
				client.red({longlan:{bonus:{bonus: client.LongLan.bonusL, box: index, bet: bet}}});
				if (!client.LongLan.bonusL) {
					var betWin = client.LongLan.bonusWin;
					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};
					huUpdate.redWin = betWin;
					uInfo.red       = betWin;
					uInfo.redWin    = betWin;
					uInfo.totall    = betWin;
					gInfo.win       = betWin;
					gInfo.totall    = betWin;
					LongLan_red.updateOne({'_id': client.LongLan.id}, {$inc:{win:betWin}}).exec();

					client.LongLan.bonus    = null;
					client.LongLan.bonusWin = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							client.red({longlan:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
						}, 700);
					});
					HU.updateOne({game:'long', type:client.LongLan.bet}, {$inc:huUpdate}).exec();
					LongLan_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
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
