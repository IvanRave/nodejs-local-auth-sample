var express = require('express');
var passport = require('passport');

var passportHelper = require('../helpers/passport-helper');
passportHelper.fill(passport);

var accountRouter = express.Router();

accountRouter.use(passport.initialize());
accountRouter.use(passport.session());

accountRouter.get('/login', function (req, res) {
	// show ejs template from the views folder
	res.render('login');

	// {
	// failuremsg : req.flash('error')
	// }
});

// accountRouter.post('/login', passport.authenticate('local', {
// //successReturnToOrRedirect : '/success-login',
// failureRedirect : '/account/login',
// failureFlash : true
// //failureFlash : 'Invalid username or password.'
// }), function (req, res) {
// // req.user - contains auth data
// res.redirect('/account/info');
// });

var cbkLogIn = function (res, next, err) {
	if (err) {
		return next(err);
	}

	return res.redirect('/account/info');
};

var cbkPauth = function (req, res, next, err, user, info) {
	if (err) {
		return next(err);
	}

	// Auth errors or info
	console.log('info', info);

	if (!user) {
		return res.redirect('/account/login?message=' + info.message);
	}

	req.logIn(user, cbkLogIn.bind(null, res, next));
};

accountRouter.post('/login', function (req, res, next) {
	passport.authenticate('local', cbkPauth.bind(null, req, res, next))(req, res, next);
});

accountRouter.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

accountRouter.get('/info', function (req, res) {
	if (req.isAuthenticated()) {
		res.send(req.user || 'no user');
	} else {
		res.send('no auth');
	}
});

exports.accountRouter = accountRouter;

module.exports = exports;
