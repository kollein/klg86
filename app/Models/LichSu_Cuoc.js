
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let mongoose      = require('mongoose');
let Schema = new mongoose.Schema({
	uid:      {type: String,  index: true}, // ID Người cược 
	phien:    {type: String}, // phiên cược
	select:   {type: Boolean},    // bên cược  (Tài = true, Xỉu = false)
	tralai:   {type: Number,  default: 0},        // Số tiền trả lại
	thuong:   {type: Number,  default: 0},        // Thưởng Red khi chơi bằng xu
	betwin:   {type: Number,  default: 0},	      // Tiền thắng được
	thanhtoan: {type: Number,  default: 1},
	tienhienco: {type: Number},
	game: {type: String},
	name: {type: String},
	bet:  {type: Number, default: 0},              // Mức cược
	chitiet: {type: String},
	win:  {type: Number, default: 0},              // Tiền thắng
	lswin:  {type: Number, default: 0},              // Tiền thắng
	type: {type: Number, default: 0, index: true}, // Loại được ăn lớn nhất trong phiên
	kq:   [],
	dichvu: {type: String},
	0:        {type: Number,  default: 0},         // Số tiền đặt Hươu
	1:        {type: Number,  default: 0},         // Số tiền đặt Bầu
	2:        {type: Number,  default: 0},         // Số tiền đặt Gà
	3:        {type: Number,  default: 0},         // Số tiền đặt Cá
	4:        {type: Number,  default: 0},         // Số tiền đặt Cua
	5:        {type: Number,  default: 0},         // Số tiền đặt Tôm
	bigWin:    {type: Boolean, default: false},    // Thắng lớn
	bot:       {type:Boolean,  default:false},     // là bot
	play: {type: Boolean, default: false},      // Phiên đang chơi
	goc:  {type: Number,  default: 0},          // Tiền gốc (mức cược gốc)
	cuoc: {type: Number,  default: 0},          // Tiền cược
	buoc: {type: Number,  default: 0},          // Số bước đã chơi
	card: {},                                   // Kết quả cuối cùng
	line: {type: Number, default: 0},         // Số dòng chọn
	a:    [],
	time:  {type: Date, default: new Date()},
});
Schema.plugin(AutoIncrement.plugin, {modelName:'LichSu_Cuoc', field:'id'});

module.exports = mongoose.model('LichSu_Cuoc', Schema);

