let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');
let Schema = new mongoose.Schema({
	uid:       {type: String,  required: true},              // ID Người cược
	name:      {type: String,  required: true},              // Name Người cược
	phien:     {type: Number,  required: true, index: true}, // phiên cược
	bet:       {type: Number,  required: true},              // số tiền cược
	select:    {type: Boolean, required: true},              // bên cược  (Tài = true, Xỉu = false)
	tralai:    {type: Number,  default: 0},                  // Số tiền trả lại
	thanhtoan: {type: Boolean, default: false},              // tình trạng thanh toán
	win:       {type: Boolean, default: false},	             // Thắng hoặc thua
	betwin:    {type: Number,  default: 0},	                 // Tiền thắng được
	wincaonhat:   {type: Number,  default: 0},
	time:      {type: Date},                                 // thời gian cược
	bot:       {type:Boolean,  default:false},               // là bot
});
Schema.plugin(AutoIncrement.plugin, {modelName:'TaiXiu_cuoc', field:'id'});
Schema.index({uid:1, thanhtoan:1}, {background:true});
module.exports = mongoose.model('TaiXiu_cuoc', Schema);
