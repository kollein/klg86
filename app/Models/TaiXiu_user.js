
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:           {type: String, required: true, unique: true},    // ID Người chơi
	tRedPlay:      {type: mongoose.Schema.Types.Long,  default: 0}, // Red Tài Xỉu đã chơi
	tWinRed:       {type: mongoose.Schema.Types.Long,  default: 0, index:true}, // Tổng red thắng
	tLostRed:      {type: mongoose.Schema.Types.Long,  default: 0, index:true}, // Tổng red thua
	totall:        {type: mongoose.Schema.Types.Long,  default: 0, index:true}, // Thắng trừ thua
	tLineWinRed:   {type: Number,  default: 0},                     // Dây thắng Red
	tLineLostRed:  {type: Number,  default: 0},                     // Dây thua Red
	first:         {type: Number,  default: 0},                     // Red - TX - Phiên đầu tiên
	last:          {type: Number,  default: 0},                     // Red - TX - Phiên cuối cùng
	tLineWinRedH:  {type: Number,  default: 0, index:true},         // Dây thắng Red hiện tại
	tLineLostRedH: {type: Number,  default: 0, index:true},         // Dây thua Red hiện tại
});

module.exports = mongoose.model('TaiXiu_user', Schema);
