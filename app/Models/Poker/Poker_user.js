
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, unique: true}, // ID Người chơi
	bet:    {type: mongoose.Schema.Types.Long, default: 0}, // Số tiền đã chơi
	win:    {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Số tiền đã thắng
	lost:   {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Số Red đã thua
	totall: {type: mongoose.Schema.Types.Long, default: 0, index:true}, // Thắng trừ thua

	playWin:  {type: Number, default: 0}, // Ván thắng
	playLost: {type: Number, default: 0}, // Ván thua
	playHoa:  {type: Number, default: 0}, // Ván hòa
});

module.exports = mongoose.model('Poker_user', Schema);
