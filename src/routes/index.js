const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "/../views");

const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", (req, res) => {
    res.redirect("/login")
});

router.get("/login", (req, res) => {
    res.sendFile(views + "/index.html");
});

module.exports = router;