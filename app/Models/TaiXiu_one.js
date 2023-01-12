
let mongoose      = require('mongoose');
let Schema = new mongoose.Schema({
	uid:      {type: String,  required: true, index: true}, // ID Người cược 
	phien:    {type: Number,  required: true, index: true}, // phiên cược
	bet:      {type: Number,  required: true},    // số tiền cược
	select:   {type: Boolean, required: true},    // bên cược  (Tài = true, Xỉu = false)
	tralai:   {type: Number,  default: 0},        // Số tiền trả lại
	thuong:   {type: Number,  default: 0},        // Thưởng Red khi chơi bằng xu
	win:      {type: Boolean, default: false},	  // Thắng hoặc thua
	betwin:   {type: Number,  default: 0},	      // Tiền thắng được
});
Schema.index({uid:1, phien:1}, {background: true});
module.exports = mongoose.model('TaiXiu_one', Schema);
