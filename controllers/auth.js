import User from '../model/User.js';
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


export const register = async (req, res) => {
  // validating request body
  if (!req.body.username) {
    return res.status(400).json('Enter a valid username');
  }
  if (!req.body.email) {
    return res.status(400).json('Enter a valid email');
  }
  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).json('Enter a valid password');
  }

  const userName = await User.find({ username: req.body.username });
  if (userName.length > 0) {
    return res.status(400).json('User with this username already exists');
  }
  const userEmail = await User.find({ email: req.body.email });
  if (userEmail.length > 0) {
    return res.status(400).json('User with this email already exists');
  }

  const salt = bcryptjs.genSaltSync(10);
  const securePassword = bcryptjs.hashSync(req.body.password, salt);
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: securePassword
    })

    const savedUser = await newUser.save();
    const { password, ...others } = savedUser._doc;
    res.status(200).json({ others });

  } catch (error) {
    return res.status(500).json(error);
  }
}

export const login = async (req, res) => {
  // vaidating the request body
  if (!req.body.email) {
    return res.status(400).json('Enter a valid email');
  }
  if (!req.body.password) {
    return res.status(400).json('Enter a valid Password');
  }

  try {
    const user = await User.find({ email: req.body.email });
    if (user.length < 0) {
      return res.status(404).json('User not found');
    }

    const securePassword = await bcryptjs.compare(req.body.password, user[0].password);
    if (!securePassword) {
      return res.status(401).json('Wrong password');
    }

    const { password, ...other } = user[0]._doc;
    const token = jwt.sign({ id: user[0]._id }, process.env.SECRET_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json(other);

  } catch (error) {
    return res.status(500).json(error);
  }
}

