
let tab_NapThe = require('../../Models/NapThe');
let NhaMang    = require('../../Models/NhaMang');
let MenhGia    = require('../../Models/MenhGia');
let UserInfo   = require('../../Models/UserInfo');
let config     = require('../../../config/thecao');
let request    = require('request');
let validator  = require('validator');
let mapNhaMangToCode = require('../../Helpers/mapNhaMangToCode');
let apikey = `77803560-2b5e-4561-94c0-35ffc047b029`;
let crypto = require('crypto');

module.exports = function(client, data){
	if (!!data && !!data.nhamang && !!data.menhgia && !!data.mathe && !!data.seri && !!data.captcha) {
		if (!validator.isLength(data.captcha, {min: 4, max: 4})) {
			client.red({notice:{title:'LỖI', text:'Captcha không đúng', load: false}});
		}else if(validator.isEmpty(data.nhamang)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng chọn nhà mạng...', load: false}});
		}else if(validator.isEmpty(data.menhgia)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng chọn mệnh giá thẻ...', load: false}});
		}else if(validator.isEmpty(data.mathe)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng nhập mã thẻ cào...', load: false}});
		}else if(validator.isEmpty(data.seri)) {
			client.red({notice:{title:'LỖI', text:'Vui lòng nhập seri ...', load: false}});
		}else{
			let checkCaptcha = new RegExp('^' + data.captcha + '$', 'i');
				checkCaptcha = checkCaptcha.test(client.captcha);
				checkCaptcha = true;
			if (checkCaptcha) {
				let nhaMang = ''+data.nhamang;
				let menhGia = ''+data.menhgia;
				let maThe   = ''+data.mathe;
				let seri    = ''+data.seri;

				let check1 = NhaMang.findOne({name:nhaMang, nap:true}).exec();
				let check2 = MenhGia.findOne({name:menhGia, nap:true}).exec();

				Promise.all([check1, check2])
				.then(values => {
					if (!!values[0] && !!values[1] && maThe.length > 11 && seri.length > 11) {

						let nhaMang_data = values[0];
						let menhGia_data = values[1];

						tab_NapThe.findOne({'uid':client.UID, 'nhaMang':nhaMang, 'menhGia':menhGia, 'maThe':maThe, 'seri':seri}, function(err, cart){
							if (cart !== null) {
								client.red({notice:{title:'THẤT BẠI', text:'Bạn đã yêu cầu nạp thẻ này trước đây.!!', load: false}});
							}else{
								let request_id = ''+Math.floor(Math.random() * Math.floor(999999));
								tab_NapThe.create({ 'uid': client.UID, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri,'requestId': request_id, 'time': new Date() }, function(error, create) {
									if (!!create) {
										let type = mapNhaMangToCode(nhaMang);
										let url = `http://gakon.club:10004/api/SIM/RegCharge?apiKey=${apikey}&code=${maThe}&serial=${seri}&type=${type}&menhGia=${menhGia}&requestId=${request_id}`;
										console.log(url);
										request.get({
											url: url,
										},
										function(err, httpResponse, body){
											console.log(body);
											try {
												let data = JSON.parse(body);
												if (data.stt == 1) {
                                                tab_NapThe.create({ 'uid': client.UID, 'status': 1, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri, 'requestId': requestId, 'time': new Date() }, function (error, create) {
                                                        if (!!create) {
                                                            MenhGia.findOne({ name: menhGia, nap: true }, {}, function (errMG, dataMG) {
                                                                if (!!dataMG) {
                                                                    let nhan = dataMG.values;
                                                                    tab_NapThe.findOneAndUpdate({ 'requestId': requestId }, { $set: { nhan: nhan } }, function (err, napthe) {
                                                                        if (!!napthe) {
                                                                            UserInfo.findOneAndUpdate({ id: client.UID }, { $inc: { red: nhan } }, function (err, result) {
                                                                                client.red({ notice: { title: 'THÔNG BÁO', text: 'Nạp thẻ thành công', load: true }, user: { red: result.red * 1 + nhan } });
                                                                            });
                                                                        } else {
                                                                            client.red({ notice: { title: 'THÔNG BÁO', text: "??? 2", load: false } });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        } else {
                                                            client.red({ notice: { title: 'THÔNG BÁO', text: "??? 0", load: false } });
                                                        }
                                                    });
												}else {
                                                    tab_NapThe.create({ 'uid': client.UID, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri, 'requestId': requestId, 'time': new Date() }, function (error, create) {
                                                        if (!!create) {
                                                            client.red({notice:{title:'THÀNH CÔNG', text:'Đang chờ Xử lý...', load: false}});
                                                        } else {
                                                            client.red({notice:{title:'THẤT BẠI', text: "Thẻ lỗi ..!  Hãy Xem Lại." , load: false}});
                                                        }
                                                    });
												} 
											} catch(e){
												client.red({notice:{title:'THẤT BẠI', text: 'Hệ thống đã ghi nhận thẻ của bạn. Vui lòng kiểm tra lịch sử giao dịch!', load: false}});
											}
										});
									
									}else{
										client.red({notice:{title:'BẢO TRÌ', text: 'Hệ thống nạp thẻ tạp thời không hoạt động, vui lòng giữ lại thẻ và quay lại sau.', load: false}});
									}
								});
							}
						});
					}else{
						client.red({notice:{title:'THẤT BẠI', text:'Thẻ nạp không được hỗ trợ.!!', load: false}});
					}
				});
			}else{
				client.red({notice:{title:'NẠP THẺ', text:'Captcha không đúng', load: false}});
			}
		}
	}
	client.c_captcha('chargeCard');
}
