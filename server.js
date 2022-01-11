if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var HttpError = require('./models/http-error');

var app = express();

var indexRouter = require('./routes/index');

// Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, PUT'
	);
	next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const error = new HttpError('Page not found', 404);
	next(error);
});

// error handler
app.use((error, req, res, next) => {
	// // set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get("env") === "development" ? err : {};
	// // render the error page
	// res.status(err.status || 500);
	res.status(error.code || 500);
	res.json({
		error: {
			status: error.code,
			message: error.message,
		},
	});
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

// app.listen(5000, console.log('Server Running'));

module.exports = app;
