const User = require("../model/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: "Registration failed",error });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );


    const cookieOptions = {
      httpOnly: true,
      secure: false, 
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000 
    };

 
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful"
    });

  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};



exports.logout = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: false 
    });

    return res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Logout failed"
    });
  }
};