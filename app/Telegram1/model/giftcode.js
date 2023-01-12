
let shortid  = require('shortid');
let telegram = require('../../Models/Telegram');
let Phone    = require('../../Models/Phone');
let GiftCode = require('../../Models/GiftCode');
let Helpers  = require('../../Helpers/Helpers');

module.exports = function(bot, id) {
	telegram.findOne({'form':id}, {}, function(err1, check){
		if (check) {
			if (!check.gift) {
				Phone.findOne({'phone':check.phone}, {}, function(err2, checkPhone){
					if (checkPhone) {
						// Gift khởi nghiệp
						key = "MD5_";
						magift = Helpers.randomString(7);
						let get_gift = (""+key+magift);
						try {
							GiftCode.create({'code':get_gift, 'red':20000, 'date':new Date(), 'todate':new Date(new Date()*1+86400000), 'to':checkPhone.uid}, function(err3, gift){
								if (!!gift){
									check.gift = true;
									check.save();
									bot.sendMessage(id, 'Chúc mừng bạn đã nhận Giftcode khởi nghiệp, mã Giftcode của bạn là: ' + get_gift, {reply_markup:{remove_keyboard:true}});
									check = null;
									bot = null;
									id = null;
								}
							});
						} catch (e){
							check = null;
							bot = null;
							id = null;
						}
					}else{
						check = null;
						bot.sendMessage(id, '_Thao tác thất bại, không thể đọc số điện thoại_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
						bot = null;
						id = null;
					}
				});
			}else{
				check = null;
				bot.sendMessage(id, '_Bạn đã nhận Giftcode Khởi nghiệp_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
				bot = null;
				id = null;
			}
		}else{
			check = null;
			bot.sendMessage(id, '_Thao tác thất bại, không thể đọc số điện thoại_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
			bot = null;
			id = null;
		}
	});
}
