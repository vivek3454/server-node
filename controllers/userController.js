const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const { compare, hash } = require("bcryptjs");
const { sendToken, cookieOptions } = require("../utils/sendToken");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user)
      return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatch = await compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Username or Password", 404));

    sendToken(res, user, 200, `Welcome Back, ${user.username}`);
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User created",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  return res.status(200).clearCookie("chat-token", cookieOptions).json({
    success: true,
    message: "Logged out successfully",
  });
};
