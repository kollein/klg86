
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String,  required: true},
    name:    {type: String,  default:"empty"},
	type:  {type: String,  required: true},
	cash:   {type:mongoose.Schema.Types.Long, default:0},
	current_cash: {type:mongoose.Schema.Types.Long, default:0},
    cnid:{type: String,  required: true},
    platform:  {type: String,  required: true},
    game_session:   {type:mongoose.Schema.Types.Long, default:0},
    date:{type: Date,    required: true}, // Thời gian tạo
});

Schema.index({uid:1, cnid:1}, {background:true});
module.exports = mongoose.model('Transaction', Schema);