const express = require("express");

const router = express.Router();

const {
  login,
  signup,
  getAllUsers,
  getMyProfile,
  logout,
} = require("../controllers/userController");
const { isAuthenticated } = require("../utils/sendToken");

router.post("/login", login);
router.post("/signup", signup);

router.use(isAuthenticated);

router.get("/all", getAllUsers);
router.get("/me", getMyProfile);
router.get("/logout", logout);

module.exports = router;
