const router = require("express").Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { isLoggedIn } = require("../utils/isLoggedIn");
const { JWT_SECRET } = require("../utils/KEY");

// index
router.get("/", isLoggedIn, (req, res) => {
  if (req.user == null) return res.redirect("/login");
  else return res.redirect("/");
});

// HANDLING REGISTER ROUTE

// GET REQUEST
router.get("/register", (req, res) => {
  res.render("index", {
    component: "register",
    alt: "login",
    altText: "Log in",
  });
});

// POST REQUEST
router.post(
  "/register",
  body("mobile").isNumeric().isLength({ min: 10, max: 10 }),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    const { name, gender, password, mobile } = req.body;
    if (!errors.isEmpty()) {
      return res.render("index", {
        component: "register",
        msg: "Invalid credentials!!",
        name,
        gender,
        password,
        mobile,
        alt: "login",
        altText: "login",
      });
    }

    try {
      const isExist = await User.findOne({ mobile });

      if (isExist !== null) {
        return res.render("index", {
          component: "register",
          msg: "Invalid credentials!!",
          name,
          gender,
          password,
          mobile,
          alt: "login",
          altText: "login",
        });
      }

      const newUser = await User.create({ name, gender, password, mobile });

      if (newUser) {
        const payload = {
          name: newUser.name,
          gender: newUser.gender,
          id: newUser._id,
        };

        const JWT_TOKEN = jwt.sign(payload, JWT_SECRET);

        res.cookie("token", JWT_TOKEN, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// HANDLING LOGIN ENDPOINT

// GET REQUEST
router.get("/login", isLoggedIn, (req, res) => {
  if (req.user !== null) return res.redirect("/");
  res.render("index", {
    component: "login",
    alt: "register",
    altText: "Register",
  });
});

// POST REQUEST
router.post(
  "/login",
  body("mobile").isNumeric().isLength({ min: 10, max: 10 }),
  async (req, res) => {
    const { password, mobile } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index", {
        component: "login",
        msg: "Invalid credentials!!",
        password,
        mobile,
        alt: "register",
        altText: "Register",
      });
    }
    try {
      const isExist = await User.findOne({ mobile });

      if (isExist == null) {
        return res.render("index", {
          component: "login",
          msg: "Invalid credentials!!",
          password,
          mobile,
          alt: "register",
          altText: "Register",
        });
      }

      if (isExist.password == password) {
        const payload = {
          name: isExist.name,
          gender: isExist.gender,
          id: isExist._id,
        };

        const JWT_TOKEN = jwt.sign(payload, JWT_SECRET);

        res.cookie("token", JWT_TOKEN, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
        res.redirect("/");
      } else {
        return res.render("index", {
          component: "login",
          msg: "Invalid credentials!!",
          password,
          mobile,
          alt: "login",
          altText: "Login",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

module.exports = router;
