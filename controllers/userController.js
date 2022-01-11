var User = require('../models/user');
var Post = require('../models/post');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

exports.user_list = async function (req, res, next) {
	try {
		const usersList = await User.find().sort([['firstName', 'ascending']]);
		res.json(usersList);
	} catch (err) {
		const error = new HttpError('Something went wrong', 500);
		return next(error);
	}
};

exports.user_find = function (req, res, next) {
	User.findById(req.params.id).exec(function (err, user) {
		if (err) {
			return next(err);
		}
		res.json(user);
	});
};

exports.user_create = async function (req, res, next) {
	try {
		const existingEmail = await User.findOne({ email: req.body.email });

		if (existingEmail) {
			const error = new HttpError('Email is already used', 500);
			return next(error);
		}
		const capFirstName =
			req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1);
		const capLastName =
			req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1);
		const hashedPassword = await bcryptjs.hash(req.body.password, 10);
		var user = new User({
			email: req.body.email,
			firstName: capFirstName,
			lastName: capLastName,
			password: hashedPassword,
		});
		user.save(function (err) {
			if (err) {
				console.log(err);
				const error = new HttpError(
					'Something went wrong. Could not save user to DB.',
					500
				);
				return next(error);
			}
			res.json({ message: 'Success' });
		});
	} catch (err) {
		console.log(err);
		const error = new HttpError('Something went wrong', 500);
		return next(error);
	}
};

exports.user_login = async function (req, res, next) {
	try {
		const userValid = await User.findOne({ email: req.body.email });
		if (!userValid) {
			const error = new HttpError('Email does not exist', 401);
			return next(error);
		}

		const passwordValid = await bcryptjs.compare(
			req.body.password,
			userValid.password
		);
		if (!passwordValid) {
			const error = new HttpError('Password does not match', 401);
			return next(error);
		}

		if (passwordValid) {
			const JWTtoken = jwt.sign(
				{ userId: userValid.id, email: userValid.email },
				process.env.SESSION_SECRET,
				{ expiresIn: '1h' }
			);
			res.json({
				userId: userValid.id,
				email: userValid.email,
				token: JWTtoken,
				fullName: userValid.firstName + ' ' + userValid.lastName,
			});
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError('Something went wrong', 500);
		return next(error);
	}
};

exports.user_auto_login = function (req, res, next) {
	res.json({ tokenValid: true });
};

exports.user_profile = async function (req, res, next) {
	try {
		const profile = await User.findById(req.params.id).populate('friends');
		const post = await Post.find({ author: req.params.id })
			.sort([['date_of_post', 'descending']])
			.populate('author')
			.populate({
				path: 'comments',
				populate: { path: 'author' },
			});
		res.json({ profile, post });
	} catch (err) {
		const error = new HttpError('Something went wrong', 500);
		next(error);
	}
};

exports.user_update = async function (req, res, next) {
	try {
		const user = await User.findById(req.userData.userId);
		if (!!req.body.birthday) {
			user.date_of_birth = new Date(req.body.birthday);
		} else {
			user.date_of_birth = undefined;
		}
		user.hometown = capitalizedString(req.body.hometown);
		user.school = capitalizedString(req.body.school);
		user.employer = capitalizedString(req.body.employer);

		user.picture = req.body.pictureData;
		user.picture_type = req.body.pictureType;

		await user.save();

		res.json(user);
	} catch (err) {
		console.log(err);
		const error = new HttpError('Something went wrong', 500);
		next(error);
	}
};

function capitalizedString(string) {
	if (!string) {
		return '';
	}

	let splitText = string.split(' ');
	let capText = '';
	splitText.forEach((element) => {
		capText =
			capText + element.charAt(0).toUpperCase() + element.slice(1) + ' ';
	});
	capText = capText.slice(0, -1);
	return capText;
}
