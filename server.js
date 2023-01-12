
require('dotenv').config();
var cors = require('cors');
let Telegram      = require('node-telegram-bot-api');
let TelegramToken = '5180271425:AAFGUtqkl4_laRpVksB4YTCswsx63sLBDew';
let TelegramBot   = new Telegram(TelegramToken, {polling: true});
let fs 			  = require('fs');
//let https     	  = require('https')
//let privateKey    = fs.readFileSync('./ssl/b86club.key', 'utf8');
//let certificate   = fs.readFileSync('./ssl/b86club.pem', 'utf8');
//let credentials   = {key: privateKey, cert: certificate};
let express       = require('express');
let app           = express();
//let server 	  	  = https.createServer(credentials, app);
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
let port       = process.env.PORT || 80;
let expressWs  = require('express-ws')(app);
let bodyParser = require('body-parser');
var morgan = require('morgan');
// Setting & Connect to the Database
let configDB = require('./config/database');
let mongoose = require('mongoose');
require('mongoose-long')(mongoose); // INT 64bit
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex',   true);
mongoose.connect(configDB.url, configDB.options); // kết nối tới database
// cấu hình tài khoản admin mặc định và các dữ liệu mặc định
require('./config/admin');
// đọc dữ liệu from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('combined'));
app.set('view engine', 'ejs'); // chỉ định view engine là ejs
app.set('views', './views');   // chỉ định thư mục view
// Serve static html, js, css, and image files from the 'public' directory
app.use(express.static('public'));
// server socket
let redT = expressWs.getWss();
process.redT = redT;
redT.telegram = TelegramBot;
global['redT'] = redT;
global['userOnline'] = 0;
require('./app/Helpers/socketUser')(redT); // Add function socket
require('./routerHttp')(app, redT);   // load các routes HTTP
require('./routerCMS')(app, redT);	//load routes CMS
require('./routerSocket')(app, redT); // load các routes WebSocket
require('./app/Cron/taixiu')(redT);   // Chạy game Tài Xỉu
require('./app/Cron/baucua')(redT);   // Chạy game Bầu Cua
require('./config/cron')();
require('./app/Telegram/Telegram')(redT); // Telegram Bot
app.listen(port, function() {
    console.log("Server listen on port ", port);
});