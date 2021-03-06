const express = require("express");

const router = express.Router();
const homeController = require("../controller/home_controller");

console.log("router loaded");

router.get("/", homeController.home);

router.use("/users", require("./users"));

// for any further route to be accesed from here
// router.use('/routerName',require('./routerFile'))

router.use("/friends", require("./friends"));

router.use("/posts", require("./posts"));

router.use("/comments", require("./comments"));

router.use("/api", require("./api"));

router.use("/likes", require("./likes"));

module.exports = router;
