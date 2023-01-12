
let TopVip   = require('../../../../Models/VipPoint/TopVip');
let Message  = require('../../../../Models/Message');
let UserInfo = require('../../../../Models/UserInfo');

let path = require('path');
let fs   = require('fs');

let numberWithCommas = require('../../../../Helpers/Helpers').numberWithCommas;

module.exports = function (client) {
	fs.readFile('./config/topVip.json', 'utf8', function(err, file){
		try{
			if(!err){
				file = JSON.parse(file);
				if (!file.status) {
					client.red({notice:{title:'THẤT BẠI', text:'Lỗi: Sự kiện chưa được kích hoạt...'}});
				}else{
					let time    = new Date();
					let timeEnd = new Date(file.begin_y, file.begin_m-1, file.begin_d);
					timeEnd.setDate(timeEnd.getDate()+file.day+1);

					time    = time.getTime();
					timeEnd = timeEnd.getTime();
					if (time >= timeEnd) {
						file.status = false;
						fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/config/topVip.json', JSON.stringify(file), function(err){});
						client.red({eventvip:file, notice:{title:'THÀNH CÔNG', text:'Trả thưởng thành công...'}});

						// Trả thưởng
						TopVip.find({}, {}, {sort:{'vip':-1}, limit:file.member}, function(err, result){
							result.forEach(function(user, index){
								if (index === 0) {
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top1}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải Nhất trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top1) + ' RED', 'time':new Date()});
									});
								}else if(index === 1){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top2}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải Nhì trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top2) + ' RED', 'time':new Date()});
									});
								}else if(index === 2){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top3}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải Ba trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top3) + ' RED', 'time':new Date()});
									});
								}else if(index === 3){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top4}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải ' + index+1 + ' trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top4) + ' RED', 'time':new Date()});
									});
								}else if(index === 4){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top5}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải ' + index+1 + ' trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top5) + ' RED', 'time':new Date()});
									});
								}else if(index > 4 && index <= 10){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top6_10}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải ' + index+1 + ' trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top6_10) + ' RED', 'time':new Date()});
									});
								}else if(index > 10 && index <= 20){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top11_20}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải ' + index+1 + ' trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top11_20) + ' RED', 'time':new Date()});
									});
								}else if(index > 20 && index <= 50){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top21_50}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải ' + index+1 + ' trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top21_50) + ' RED', 'time':new Date()});
									});
								}else if(index > 50){
									UserInfo.findOneAndUpdate({'name':user.name}, {$inc:{'red':file.top51_xxx}}).exec(function(err, info){
										!!info && Message.create({'uid':info.id, 'title':'Sự Kiện Siêu TOP', 'text':'Xin Chúc Mừng!!' + '\n\n' + 'Bạn đoạt giải ' + index+1 + ' trong sự kiện Đua TOP VipPoint, Giải thưởng của bạn là  ' + numberWithCommas(file.top51_xxx) + ' RED', 'time':new Date()});
									});
								}
							});
							//file = null;
							TopVip.deleteMany({}).exec();
						});
					}else{
						client.red({notice:{title:'THẤT BẠI', text:'Không thể trả thưởng khi sự kiện chưa kết thúc...'}});
					}
				}
				client = null;
			}
		}catch(e){
		}
	});
}
