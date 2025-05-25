const express = require('express');
const { userAuth } = require('../middlewares/auth');

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {

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

module.exports = profileRouter;