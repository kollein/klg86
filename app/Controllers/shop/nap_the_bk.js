let tab_NapThe = require('../../Models/NapThe');
let NhaMang = require('../../Models/NhaMang');
let MenhGia = require('../../Models/MenhGia');
let UserInfo = require('../../Models/UserInfo');
let config = require('../../../config/thecao');
let request = require('request');
let validator = require('validator');
let crypto = require('crypto');

module.exports = function (client, data) {
	if (!!data && !!data.nhamang && !!data.menhgia && !!data.mathe && !!data.seri && !!data.captcha) {
		if (!validator.isLength(data.captcha, { min: 4, max: 4 })) {
			client.red({ notice: { title: 'LỖI', text: 'Captcha không đúng', load: false } });
		} else if (validator.isEmpty(data.nhamang)) {
			client.red({ notice: { title: 'LỖI', text: 'Vui lòng chọn nhà mạng...', load: false } });
		} else if (validator.isEmpty(data.menhgia)) {
			client.red({ notice: { title: 'LỖI', text: 'Vui lòng chọn mệnh giá thẻ...', load: false } });
		} else if (validator.isEmpty(data.mathe)) {
			client.red({ notice: { title: 'LỖI', text: 'Vui lòng nhập mã thẻ cào...', load: false } });
		} else if (validator.isEmpty(data.seri)) {
			client.red({ notice: { title: 'LỖI', text: 'Vui lòng nhập seri ...', load: false } });
		} else {
			let checkCaptcha = new RegExp('^' + data.captcha + '$', 'i');
			checkCaptcha = checkCaptcha.test(client.captcha);
			if (checkCaptcha) {
				let nhaMang = '' + data.nhamang;
				let menhGia = '' + data.menhgia;
				let maThe = '' + data.mathe;
				let request_id = '' + Math.floor(Math.random() * Math.floor(999999));
				let seri = '' + data.seri;
				let check1 = NhaMang.findOne({ name: nhaMang, nap: true }).exec();
				let check2 = MenhGia.findOne({ name: menhGia, nap: true }).exec();

				Promise.all([check1, check2])
					.then(values => {
						if (!!values[0] && !!values[1] && maThe.length > 8 && seri.length > 8) {

							let nhaMang_data = values[0];
							let menhGia_data = values[1];

							tab_NapThe.findOne({ 'uid': client.UID, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri }, function (err, cart) {
								if (cart !== null) {
									client.red({ notice: { title: 'THẤT BẠI', text: 'Bạn đã yêu cầu nạp thẻ này trước đây.!!', load: false } });
								} else {

									tab_NapThe.create({ 'uid': client.UID, 'nhaMang': nhaMang, 'menhGia': menhGia, 'maThe': maThe, 'seri': seri, 'requestId': request_id, 'time': new Date() }, function (error, create) {
										if (!!create) {

											var mang_thesieutoc = "";
											if (nhaMang == "Viettel") {
												mang_thesieutoc = 'VIETTEL';
											} else if (nhaMang == "Vinaphone") {
												mang_thesieutoc = 'VINAPHONE';
											} else if (nhaMang == "Mobifone") {
												mang_thesieutoc = 'MOBIFONE';
											}
											console.log(mang_thesieutoc + '-' + nhaMang + '-')
											let apiKey = "qZptIuQlJzxaVUAbWHNkBngPKimEMXoGwrFdTCcvjYehOLfDysSR";
											let callback = "https://api.king789.win/thesieunhanh/tst_callback";
											let url = `https://thesieunhanh.net/api/card-auto.php?type=${nhaMang}&menhgia=${data.menhgia}&seri=${data.seri}&pin=${data.mathe}&APIKey=${apiKey}&callback=${callback}&content=${request_id}`;
											request.get(
												// 'https://tstprovn.fun/chargingws/v2?APIkey=1624797342c095e91e50cc48656b1bb01c90521b'
												// +'&mathe='+data.mathe+'&seri='+data.seri+'&type='+mang_thesieutoc
												// +'&menhgia='+data.menhgia+'&content='+request_id
												url
												, function (err, httpResponse, body) {
													try {
														console.log(body);
														let data = JSON.parse(body);
														// if (data['status'] == '00' || data['status'] == 'thanhcong') {
														if (data.data.status == "success") {
															console.log(client.UID);
															client.red({ notice: { title: 'THANH CONG', text: 'Thẻ đang được hệ thống nạp xin vui lòng đợi', load: false } });
															// let nhan = menhGia_data.values;
															// tab_NapThe.updateOne({'_id':cID}, {$set:{nhan:nhan, status:1}}).exec();
															// UserInfo.findOneAndUpdate({'id':client.UID}, {$inc:{red:nhan}}, function(err2, user) {
															// 	client.red({notice:{title:'THÀNH CÔNG', text:'Nạp thẻ thành công...', load: false}, user:{red: user.red*1+nhan}});
															// });
														}
														else {
															console.log(client.UID);
															tab_NapThe.updateOne({ 'requestId': request_id }, { $set: { nhan: 0, status: 2 } }).exec();
															client.red({ notice: { title: 'THẤT BẠI', text: "Nạp thẻ thất bại, hãy thử lại.", load: false } });
														}
													} catch (e) {
														console.log(e);
														client.red({ notice: { title: 'THẤT BẠI', text: 'Hệ thống nạp thẻ tạm thời không hoạt động, Vui lòng quay lại sau.!', load: false } });
													}
												});
										} else {
											//client.red({ notice: { title: 'BẢO TRÌ', text: 'Hệ thống nạp thẻ tạp thời không hoạt động, vui lòng giữ lại thẻ và quay lại sau.', load: false } });
										}
									});
								}
							});
						} else {
							client.red({ notice: { title: 'THẤT BẠI', text: 'Thẻ nạp không được hỗ trợ.!!', load: false } });
						}
					});
			} else {
				client.red({ notice: { title: 'NẠP THẺ', text: 'Captcha không đúng', load: false } });
			}
		}
	}
	client.c_captcha('chargeCard');
}