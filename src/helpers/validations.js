const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First and Last name is Required");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password must contains Eight character in which at least one special character, uppercase and number: " + password);
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "photoURL", "about"];

    const {skills} = req.body;

    if(skills.length > 20) {
        return {valid: false, message: "Skills set is exceded"};
    }

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    if(!isEditAllowed) {
        return {valid: false, message: "Invalid Edit Request!!"};
    }
    return {valid: true};
};

module.exports = {
    validateSignUpData, validateEditProfileData
}