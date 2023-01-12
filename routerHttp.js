
// Router HTTP / HTTPS
let mobile = require('is-mobile');
let bank   = require('./routes/bank');
module.exports = function(app, redT) {
	// Home
	app.get('/', function(req, res) {
		if (mobile({ua:req})){
			return res.redirect('/mobile/');
		} else {
			return res.redirect('/playgame/');
		}
	});
	app.get('/playgame/', function(req, res) {
		if (mobile({ua:req})){
			return res.redirect('/mobile/');
		} else {
			return res.render('index');
		}
	});
	app.get('/playgame/', function(req, res) {
		if (mobile({ua:req})){
			return res.render('index_mobile');
		} else {
			return res.redirect('/playgame/');
		}
	});

	// Android
	app.get('/download/android', function(req, res) {
		return res.render('download/android');
	});

	// Admin
	app.get('/68ClubA/', function(req, res) {
		return res.render('admin');
	});

	// Fanpage
	app.get('/fanpage/', function(req, res) {
		return require('./routes/fanpage/redirect')(res);
	});

	// Help IOS
	app.get('/help/ios/', function(req, res) {
		return res.render('help/ios');
	});

	//Telegram
	app.get('/telegram/', function(req, res) {
		return require('./routes/telegram/redirect')(res);
	});
	
	app.get('/c40e7445f27f71a00365b36588d60e77', function(req, res) {
        return require('./app/Controllers/shop/nap_the_callback')(req,res);
    });


    app.get('/088dcf626ca3f3b95d99751aww259718806', function(req, res) {
        return require('./app/Controllers/shop/momocallback')(req,res);
    });

    app.post('/6917cf2fb438e866b63341fbce6ea8c7', function(req, res) {
        return require('./app/Controllers/shop/bankcallback')(req,res);
    });
	app.get('/autochagermmconnect', function(req, res) {
        return require('./app/Controllers/shop/autocallback')(req,res);
    });

	// Sign API
	require('./routes/api')(app, redT);  // load routes API
};
