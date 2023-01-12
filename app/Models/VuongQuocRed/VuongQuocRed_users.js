
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, unique: true}, // ID Người chơi
	hu:     {type: Number, default: 0},                     // Số lần Nổ Hũ REd
	bet:    {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Số tiền đã chơi
	win:    {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Số tiền đã thắng
	lost:   {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Số Red đã thua
	totall: {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Thắng trừ thua
	time:   {type: mongoose.Schema.Types.Long, default: 0}, // quay gần đây
	select: {type: Number, default: 0}, // quay gần đây
});
module.exports = mongoose.model('VuongQuocRed_users', Schema);
