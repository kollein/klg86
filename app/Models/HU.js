
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	game: {type: String,  required: true, index:true},      // Tên game
	name: {type: String,  default: ''},   // Tên người được gọi
    md5key: {type: String,  default: ''},  
	titles: {type: String,  default: 'WELCOME MD5CLUB'},
    hutx: {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red đã chơi
	type: {type: Number,  required: true},                   // Loại hũ (100, 1000, 10000)
	red:  {type: Boolean, required: true},                   // Hũ Xu hoặc Hũ Red
	bet:  {type: Number,  default: 0},                       // Giá trị hiện tại của hũ
	min:  {type: Number,  default: 0},                       // Giá trị nhỏ nhất của hũ
	toX:     {type: Number, default: 0},                     // Sau ... hũ đến X6 hũ
	balans:  {type: Number, default: 0},                     // Số hũ còn lại
	x:       {type: Number, default: 0},                     // Hệ số nhân
	hu:      {type: Number, default: 0},                     // Hũ Red đã nổ
	redPlay: {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red đã chơi
	redWin:  {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red thắng
	redLost: {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Red thua
});

Schema.index({game:1, type:1, red:1}, {background: true});

module.exports = mongoose.model('hu', Schema);
