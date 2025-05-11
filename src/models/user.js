const mongoose = require('mongoose')

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
	},
	age: {
		type: Number,
		required: true,
		min: 18,
		trim: true,
	},
	gender: {
		type: String,
		required: true,
		validate(value) {
			if(!["male", "female", "others"].includes(value)) {
				throw new Error("Invalid Gender data")
			}
		},
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	photo: {
		type: String,
		default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcampussafetyconference.com%2Fbusinessman-silhouette-as-avatar-or-default-profile-picture&psig=AOvVaw052_WlhwliZsXJq08Fz3Ha&ust=1747067950517000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjViMLtm40DFQAAAAAdAAAAABAE"
	}
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);