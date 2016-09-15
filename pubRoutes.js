var bunyan = require("bunyan");
var log = bunyan.createLogger({name: "user"});

pubRouter.get( "/home", routes.public.home );

pubRouter.get( "/login", function( req, res ){
	log.info("get yer login page here!");
	res.render( "loginpage" );
});

pubRouter.post('/login', bodyParser.urlencoded({ extended: true }), function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err) }
		if (!user) {
			req.session.messages = [info.message];
			return res.redirect('/login')
		}
		req.logIn(user, function (err) {
			if (err) { return next(err); }
			return res.redirect('/home');
		});
	})
	(req, res, next);
});

pubRouter.get( "/", routes.public.home );
