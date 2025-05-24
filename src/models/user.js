const mongoose = require('mongoose');
const validator = require("validator")

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		minLength: 4,
		maxLength: 50,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		minLength: 4,
		maxLength: 50,
		trim: true,
	},
	emailId: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if(!validator.isEmail(value)) {
				throw new Error("Invalid Email Address: ", value)
			}
		}
	},
	age: {
		type: Number,
		min: 18,
		trim: true,
	},
	gender: {
		type: String,
		validate(value) {
			if(!["male", "female", "others"].includes(value)) {
				throw new Error("Invalid Gender data");
			};
		},
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
			if(!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
				throw new Error("Password must contains Eight character in which at least one special character, uppercase and number: " + value)
			}
		}
	},
	photoURL: {
		type: String,
		default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcampussafetyconference.com%2Fbusinessman-silhouette-as-avatar-or-default-profile-picture&psig=AOvVaw052_WlhwliZsXJq08Fz3Ha&ust=1747067950517000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjViMLtm40DFQAAAAAdAAAAABAE",
		validate(value) {
			if(!validator.isURL(value)) {
				throw new Error("Invalid Photo URL: " + value)
			}
		}
	}
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);