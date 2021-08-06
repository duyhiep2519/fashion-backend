import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//getProfile
export const getInfo = async (req, res, next) => {
  const user = req.user._id;

  try {
    const result = await User.findById({ _id: user });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res, next) => {
  const check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).send("Email đã được đăng ký!");
  }
  try {
    const data = req.body;

    const user = await User.create(data);
    if (user) {
      res.status(200).send("Đăng ký thành công!");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//login

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(500).send("Tài khoản chưa được đăng ký!");
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(500).send("Sai mật khẩu!");
    }
    const token = jwt.sign({ user }, process.env.SECRET_SIGN, {
      expiresIn: "1d",
    });
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
