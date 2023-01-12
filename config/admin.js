
// Khởi tạo dữ liệu

// Admin
let Admin        = require('../app/Models/Admin');
let generateHash = require('../app/Helpers/Helpers').generateHash;
let HU           = require('../app/Models/HU');
let HUTX           = require('../app/Models/HUTX');
let ZeusPercent  = require('../app/Models/Zeus/Zeus_percent');
let ThongBao     = require('../app/Models/Title');
let Hutaixiu     = require('../app/Models/TaiXiu/HuTX');
let CaoboiPercent  = require('../app/Models/Caoboi/Caoboi_percent');
let getmomoacc = require('../app/Models/Bank/accmomo');
let doanhthu = require('../app/Models/doanhthu');
Admin.estimatedDocumentCount().exec(function(err, total){
	if (total == 0) {
		Admin.create({'username': 'admin', 'password': generateHash('123456'), 'rights': 9, 'regDate': new Date()});
	}
	if (total == 1) {
		//Admin.create({'username': 'admin190', 'password': generateHash('vn1102'), 'rights': 1, 'id':22, 'regDate': new Date()});
	}
});
ThongBao.findOne({}, function(err, data){
	if (!data) {
		ThongBao.create({'thongbao1':'Govip88 Game xanh chín uy tín', 'active':'1', 'thongbao2': 'Các siêu đại gia xuống tiền nhẹ tay cho các game thủ vào tiền nữa nhé !'});
	}
})
Hutaixiu.findOne({}, function(err, data){
	if (!data) {
		Hutaixiu.create({'md5key':'abc3339d42a5d25bb3cfcc994a06ea13', 'hutx':'5000000', 'ketquaphien': '[423]_{#6627-NSG7fPIieBkQ7iigewSizt}'});
	}
})
doanhthu.findOne({}, function(err, data){
	if (!data) {
		doanhthu.create({'id':1, 'tiennap':'0', 'tienrut':'0'});
	}
})

getmomoacc.findOne({}, function(err, data){
	if (!data) {
		getmomoacc.create({'id':1, 'phone':'0943934466', 'name':'NGUYỄN VĂN KIÊN'});
	}
})
// Bầu Cua
let BauCua = require('../app/Models/BauCua/BauCua_temp');
BauCua.findOne({}, {}, function(err, data){
	if (!data) {
		BauCua.create({});
	}
});
HU.findOne({game:'taixiumd5', type:1, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'taixiumd5', 'type': 1, red: true, 'md5key': 'ABCghdjhdhhrruru', 'hutx':50000000, 'min': 0});
	}
})
HUTX.findOne({phiennohu:1, id:1}, {}, function(err, data){
	if (!data) {
		HUTX.create({phiennohu:1, 'id':1});
	}
})
// thiết lập Hũ Mini Poker
HU.findOne({game:'minipoker', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'minipoker', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'minipoker', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'minipoker', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'minipoker', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'minipoker', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})


// thiết lập Hũ BigBabol
HU.findOne({game:'bigbabol', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'bigbabol', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'bigbabol', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'bigbabol', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'bigbabol', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'bigbabol', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})


// thiết lập Hũ Vương Quốc Red
HU.findOne({game:'vuongquocred', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'vuongquocred', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'vuongquocred', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'vuongquocred', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'vuongquocred', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'vuongquocred', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ Dong mau anh hung
HU.findOne({game:'dongmauanhhung', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'dongmauanhhung', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'dongmauanhhung', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'dongmauanhhung', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'dongmauanhhung', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'dongmauanhhung', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ Cao Thấp
HU.findOne({game:'caothap', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 1000, red: true, 'bet': 7000, 'min': 7000});
	}
})

HU.findOne({game:'caothap', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 10000, red: true, 'bet': 70000, 'min': 70000});
	}
})

HU.findOne({game:'caothap', type:50000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 50000, red: true, 'bet': 350000, 'min': 350000});
	}
})

HU.findOne({game:'caothap', type:100000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 100000, red: true, 'bet': 700000, 'min': 700000});
	}
})

HU.findOne({game:'caothap', type:500000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'caothap', 'type': 500000, red: true, 'bet': 3500000, 'min': 3500000});
	}
})

// thiết lập Hũ AngryBirds
HU.findOne({game:'arb', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'arb', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'arb', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'arb', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})


// thiết lập Hũ Candy
HU.findOne({game:'candy', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'candy', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'candy', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'candy', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'candy', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'candy', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ sexandzen
HU.findOne({game:'sexandzen', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'sexandzen', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'sexandzen', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'sexandzen', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'sexandzen', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'sexandzen', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ Long Lân
HU.findOne({game:'long', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'long', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'long', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'long', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ Royal
HU.findOne({game:'roy', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'roy', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'roy', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'roy', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'roy', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'roy', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ Siêu Xe
HU.findOne({game:'sieu', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'sieu', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'sieu', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'sieu', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'sieu', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'sieu', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})

// thiết lập Hũ Zeus
HU.findOne({game:'Zeus', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'Zeus', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'Zeus', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'Zeus', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'Zeus', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'Zeus', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
// thiết lập Hũ Cao Bồi
HU.findOne({game:'Caoboi', type:100, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'Caoboi', 'type': 100, red: true, 'bet': 500000, 'min': 500000});
	}
})

HU.findOne({game:'Caoboi', type:1000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'Caoboi', 'type': 1000, red: true, 'bet': 5000000, 'min': 5000000});
	}
})

HU.findOne({game:'Caoboi', type:10000, red: true}, {}, function(err, data){
	if (!data) {
		HU.create({'game':'Caoboi', 'type': 10000, red: true, 'bet': 50000000, 'min': 50000000});
	}
})
