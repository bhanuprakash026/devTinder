const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {validateEditProfileData} = require("../helpers/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user
        if (!user) {
            throw new Error("User not found");
        }
        res.send(user);

    } catch (error) {
        res.send("ERROR : " + error.message);
    };
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        const isValid = validateEditProfileData(req)
        if(!isValid.valid) {
            throw new Error(isValid.message);
        };

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(element => {
            loggedInUser[element] = req.body[element];
        });

        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName}, profile updated Successfully..`, data: loggedInUser});
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = profileRouter;