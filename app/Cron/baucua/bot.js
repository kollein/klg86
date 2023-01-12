
let BauCua_cuoc = require('../../Models/BauCua/BauCua_cuoc');

/**
 * Ngẫu nhiên cược
 * return {number}
*/
let random = function(){
	let a = (Math.random()*35)>>0;
	if (a == 34) {
		// 34
		return (Math.floor(Math.random()*(20-3+1))+3)*10000;
	}else if (a >= 32 && a < 34) {
		// 32 33
		return (Math.floor(Math.random()*(20-5+1))+5)*1000;
	}else if (a >= 30 && a < 32) {
		// 30 31 32
		return (Math.floor(Math.random()*(20-10+1))+10)*1000;
	}else if (a >= 26 && a < 30) {
		// 26 27 28 29
		return (Math.floor(Math.random()*(100-10+1))+10)*1000;
	}else if (a >= 21 && a < 26) {
		// 21 22 23 24 25
		return (Math.floor(Math.random()*(200-10+1))+10)*1000;
	}else if (a >= 15 && a < 21) {
		// 15 16 17 18 19 20
		return (Math.floor(Math.random()*(10-5+1))+5)*10000;
	}else if (a >= 8 && a < 15) {
		// 8 9 10 11 12 13 14
		return (Math.floor(Math.random()*(7-2+1))+2)*10000;
	}else{
		// 0 1 2 3 4 5 6 7
		return (Math.floor(Math.random()*(100-10+1))+10)*1000;
	}
};

/**
 * Cược
*/

// Bầu cua RED
module.exports = function(bot, io){
	let cuoc = random();
	let userCuoc = (Math.random()*6)>>0;

	if (userCuoc == 0) {
		io.baucua.info.redHuou += cuoc;
	}else if (userCuoc == 1) {
		io.baucua.info.redBau  += cuoc;
	}else if (userCuoc == 2) {
		io.baucua.info.redGa   += cuoc;
	}else if (userCuoc == 3) {
		io.baucua.info.redCa   += cuoc;
	}else if (userCuoc == 4) {
		io.baucua.info.redCua  += cuoc;
	}else if (userCuoc == 5) {
		io.baucua.info.redTom  += cuoc;
	}
if(cuoc > 200000){
	let create = {uid:bot.id, bot:true, name:bot.name, phien:io.BauCua_phien, time:new Date()};
	create[userCuoc] = cuoc;
	BauCua_cuoc.create(create);}
	bot = null;
	io = null;
	create = null;
	cuoc = null;
	userCuoc = null;
}
