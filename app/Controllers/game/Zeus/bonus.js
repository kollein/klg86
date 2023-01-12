
let HU            = require('../../../Models/HU');
let Zeus_red  = require('../../../Models/LichSu_Cuoc');
let Zeus_user = require('../../../Models/Zeus/Zeus_user');
let UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.Zeus &&
		client.Zeus.bonus !== null &&
		client.Zeus.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.Zeus.bonus[index]) {
			if (!client.Zeus.bonus[index].isOpen) {
				client.Zeus.bonusL -= 1;
				client.Zeus.bonus[index].isOpen = true;

				var bet = client.Zeus.bonus[index].bet;
				client.Zeus.bonusWin += bet;
				client.red({Zeus:{bonus:{bonus: client.Zeus.bonusL, box: index, bet: bet}}});
				if (!client.Zeus.bonusL) {
					var betWin = client.Zeus.bonusWin;
					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};
						huUpdate.redWin = betWin;
						uInfo.red       = betWin;
						uInfo.redWin    = betWin;
						gInfo.win       = betWin;
						Zeus_red.updateOne({'_id': client.Zeus.id}, {$inc:{win:betWin, tienhienco:betWin}}).exec();
					}
					client.Zeus.bonus    = null;
					client.Zeus.bonusWin = 0;
					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
								client.red({Zeus:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
						}, 700);
					});
					HU.updateOne({game:'Zeus', type:client.Zeus.bet}, {$inc:huUpdate}).exec();
					Zeus_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
				}
			}
		}
	}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
