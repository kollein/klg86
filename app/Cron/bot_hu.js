
//let angrybird  = require('./bot_hu/angrybird');
let bubg   = require('./bot_hu/bigbabol');
let candy      = require('./bot_hu/candy');
let sexandzen      = require('./bot_hu/sexandzen');
let longlan    = require('./bot_hu/longlan');
//let thuonghai    = require('./bot_hu/thuonghai');
let royal    = require('./bot_hu/royal');
let sieuxe    = require('./bot_hu/sieuxe');
let zeus    = require('./bot_hu/zeus');
let caoboi    = require('./bot_hu/caoboi');
//let tamhung    = require('./bot_hu/tamhung');
//let mini3cay   = require('./bot_hu/mini3cay');
let minipoker  = require('./bot_hu/minipoker');
let vqred      = require('./bot_hu/vqred');
let dmanhhung      = require('./bot_hu/dmanhhung');

module.exports = function(io, listBot){
	setTimeout(() =>{
		bubg(io, listBot);
	}, 10000); 
    setTimeout(() =>{
		minipoker(io, listBot);
	}, 10000); 
	setTimeout(() =>{
		candy(io, listBot);
	}, 150000);
	setTimeout(() =>{
		sexandzen(io, listBot);
	}, 150000);
	
	setTimeout(() =>{
		longlan(io, listBot);
	}, 150000);
//setTimeout(() =>{
//		thuonghai(io, listBot);
//;	}, 200000);
	setTimeout(() =>{
		royal(io, listBot);
	}, 150000);
	setTimeout(() =>{
		sieuxe(io, listBot);
	}, 150000);

	setTimeout(() =>{
		vqred(io, listBot);
	}, 150000);
	setTimeout(() =>{
		dmanhhung(io, listBot);
	}, 150000);
	setTimeout(() =>{
		caoboi(io, listBot);
	}, 150000);
	setTimeout(() =>{
		zeus(io, listBot);
		listBot = null;
		io = null;
	}, 150000);
};
