const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//REGISTER
router.post("/register", async (req, res) => {        
    !req.body.username && res.status(401).json("No username inserted");
    !req.body.email && res.status(401).json("No email inserted");
    !req.body.password && res.status(401).json("No password inserted");
    
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    };
});

//LOGIN
router.post("/post", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong credentials!");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const password = hashedPassword.toString();
        password !== req.body.password && res.status(401).json("Wrong credentials!");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;