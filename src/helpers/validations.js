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
}

module.exports = {
    validateSignUpData
}