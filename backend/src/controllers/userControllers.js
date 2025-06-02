const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  createToken,
  generateVerificationToken,
  verifyToken,
} = require("../utils/validate");
const { sendEmail } = require("../utils/emailTransporter");

const handleCreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "All Fields Are Mandatory!",
      });

    const user = await User.findOne({ where: { email } });
    if (user)
      return res.status(400).json({
        success: false,
        message: "User Already Exists!",
      });

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
    });

    const token = generateVerificationToken(newUser.id);
    await sendEmail(email, token);

    return res.status(201).json({
      success: true,
      message: "User Created Successfully!",
      data: { user: newUser },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.error(error);
  }
};

const handleLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "All Fields Are Mandatory!",
      });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "No User Found!",
      });

    if (!user.isVerified) {
      await sendEmail(email, generateVerificationToken(user.id));
      return res.status(400).json({
        success: false,
        message:
          "Email Not Verified! Please check your email for verification link.",
      });
    }

    const check = await bcrypt.compare(password, user.password);

    if (check) {
      const token = createToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log("Token : ", token);
      return res.status(200).json({
        success: true,
        message: "User Logged In Successfully!",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password Not Matched!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.error(error);
  }
};

const handleVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token)
      return res.status(400).json({
        success: false,
        message: "Token is required for email verification.",
      });

    const { userId } = verifyToken(token);
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });

    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.error(error);
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const { name, email, profileURL } = req.body;
    const userId = req.user.id;

    if (!email)
      return res.status(400).json({
        success: false,
        message: "Name and Email are required!",
      });

    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });

    user.name = name || user.name;
    user.profileURL = profileURL || user.profileURL;

    await user.save();

    return res.status(202).json({
      success: true,
      message: "User updated successfully!",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.error(error);
  }
};

const handleGetUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });

    return res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.error(error);
  }
};

const handleLogoutUser = async(req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.error(error);
  }
};

module.exports = {
  handleCreateUser,
  handleLoginUser,
  handleVerifyEmail,
  handleUpdateUser,
  handleGetUser,
  handleLogoutUser,
};
