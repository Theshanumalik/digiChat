const router = require("express").Router();
const User = require("../models/users");

router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/setting", (req, res) => {
  res.send("Setting page ");
});

module.exports = router;
