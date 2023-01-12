var Bank_history = require('../../../Models/Bank/Bank_history');
var UserInfo = require('../../../Models/UserInfo');
var TX_User  = require('../../../Models/TaiXiu_user');
var nhiemvutx = require('../../../Models/TaiXiu_cuoc');
var nhiemvu  = require('../../../Models/NhiemVu');
let DataNhiemVu    = require('../../../../data/nhiemvu');
let User      = require('../../../Models/Users');

var Helper      = require('../../../Helpers/Helpers');

function taixiu(client, data){
	if(!!data){
		//console.log(data);
        TX_User.findOne({'uid': client.UID}, 'tRedPlay tWinRed tLostRed', function(err2, result){
			if (!!result) {
				let tRedPlay = result.tWinRed;
				if (tRedPlay < data.dieukien) {
					client.red({notice:{title:"NHIỆM VỤ", text:'Chưa đủ điều kiện để nhận thưởng !'}});
				} else {
					nhiemvu.findOne({'uid':client.UID, 'id':data.id}, function(err1, crack){
						if (crack) {
							client.red({notice:{title:"NHIỆM VỤ", text:'Bạn đã nhận thưởng rồi !'}});
						}else{
			
								client.red({notice:{title:"NHIỆM VỤ", text:'Chắc trêu, chú tưởng chúng tôi là gà !'}});
								User.updateOne({'_id':client.UID}, {$set:{lock:true}}).exec();
					
							
						}
					});
				}
			}else if (err2) {
				console.log(err2);
			}
        });
	}
}

module.exports = function(client, data) {
	if (!!data) {
		switch (data) {
			case data > 100 && data < 999:
				taixiu(client, data)
				break;
			default:
				taixiu(client, data)
				break;
		}

	}
};
