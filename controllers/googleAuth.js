import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const client = new OAuth2Client(process.env.SECRET_SIGN);
export const getUserRecord = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//google login
export const googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });
    const { email_verified, name, email, picture } = ticket.getPayload();
    if (email_verified) {
      const user = await User.findOne({ email: email });
      if (!user) {
        const user = await User.create({
          username: name,
          email: email,
          photo: picture,
          password: email + process.env.SECRET_SIGN,
        });
        const token = jwt.sign({ user }, process.env.SECRET_SIGN, {
          expiresIn: "1d",
        });
        res.status(200).json({ token: token });
      } else {
        const token = jwt.sign({ user }, process.env.SECRET_SIGN, {
          expiresIn: "1d",
        });
        res.status(200).json({ token: token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
