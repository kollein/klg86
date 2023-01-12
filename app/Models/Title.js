let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	thongbao1: {type: String,  default: ''},   // Tên người được gọi
	thongbao2: {type: String,  default: ''}, 
	thongbao3: {type: String,  default: ''}, 
	hienthitb: {type: String,  default: ''}, 
	active: {type: String,  default: '1'},
});

module.exports = mongoose.model('ThongBao', Schema);