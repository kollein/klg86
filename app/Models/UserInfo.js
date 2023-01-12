
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	id:        {type:String, required:true, unique:true}, // ID đăng nhập
	name:      {type:String, required:true, unique:true}, // Tên nhân vật
	avatar:    {type:String, default:'0'},       // Tên avatar
	joinedOn:  {type:Date, default:new Date()}, // Ngày tham gia
	email:     {type: String, default: ''}, // EMail
	cmt:       {type: String, default: ''}, // CMT
	security:  {                          // Bảo Mật
		login:  {type:Number, default:0}, // Bảo mật đăng nhập
	},
	red:       {type:mongoose.Schema.Types.Long, default:0, index:true},     //Sunmd5
	ketSat:    {type:mongoose.Schema.Types.Long, default:0},     //Sunmd5 trong két sắt
	redWin:    {type:mongoose.Schema.Types.Long, default:0},   // TổngSunmd5 thắng
	redLost:   {type:mongoose.Schema.Types.Long, default:0},   // TổngSunmd5 thua
	tongnap:    {type:mongoose.Schema.Types.Long, default:0},   // TổngSunmd5 thắng
	tongrut:    {type:mongoose.Schema.Types.Long, default:0},   // TổngSunmd5 thắng
	redPlay:   {type:mongoose.Schema.Types.Long, default:0},   // TổngSunmd5 đã chơi
	totall:    {type:mongoose.Schema.Types.Long, default:0, index:true},   // Thắng trừ thua
	vip:       {type:Number, default:0},                         // Tổng vip tích luỹ (Vip đã đổi thưởng)
	lastVip:   {type:mongoose.Schema.Types.Long, default:0},     // Cập nhật lần đổi thưởng cuối
	hu:        {type:Number, default:0},                         // Số lần Nổ Hũ Sunmd5
	type:      {type:Boolean, default:false, index:true},        // Bot = true | Users = false
	veryphone: {type:Boolean, default:false},                    // Trạng thái xác thực
	veryold:   {type:Boolean, default:false},                    // Đã từng xác thực
	otpFirst:  {type:Boolean, default:false},                    // Kiểm tra lần đầu lấy mã OTP
	gitCode:   {type:Number,  default:0},                        // Số lần Lấy mã GiftCode thành công
	gitRed:    {type:Number,  default:0},                        // Tiền lấy đc từ GiftCode
	gitTime:   {type:Date},                                      // Ngày sử dụng Gitfcode
	rights:    {type:Number,  default:0},                        // Cấp bậc
});

Schema.plugin(AutoIncrement.plugin, {modelName:'UserInfo', field:'UID'});

module.exports = mongoose.model('UserInfo', Schema);
