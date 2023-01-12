
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type:String,  required:true, index:true}, // ID Người chơi
	room:   {type:Number,  required:true},             // phòng (100, 1000, ...)
	bet:    {type:Number,  default:0},	               // Tiền Cược
	win:    {type:Boolean, default:false},	           // Thắng hoặc thua
	tralai: {type:Number,  default:0},	               // Tiền thắng được
	time:   {type:Date,    default:new Date()},
});

module.exports = mongoose.model('Poker_history', Schema);
