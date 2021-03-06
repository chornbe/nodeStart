
// get my info
//apiRouter.get( "/user", routes.user.myinfo );
apiRouter.get( "/user", function( req, res, next ){
	if( req.user ){
		var usr = JSON.parse( JSON.stringify( req.user ) );
		delete usr.password;
		res.statusCode = 200;
		res.end( JSON.stringify(usr), next );
		return;
	}

	res.statusCode = 403;
	res.end("not logged in");
});

apiRouter.get( "*", function( req, res ){
	res.statusCode = 404;
	var statObj = { statusCode: 404, error: "api call not found", url: req.url, method: req.method };
	res.end( JSON.stringify( statObj ) );
});