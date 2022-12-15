const router = require("express").Router();
const User = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const { isLoggedIn } = require("../utils/isLoggedIn");

router.get("/", isLoggedIn, (req, res) => {
  const uid = uuidv4();
  const { name, gender, id } = req.user;
  if (req.user !== null)
    return res.render("openChat", { name, gender, id, groupId: uid });
});

router.get("/:uid", (req, res) => {
  res.render("anonymous", {
    id: uuidv4(),
    groupId: req.params.uid,
  });
});

module.exports = router;
