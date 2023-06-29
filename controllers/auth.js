import User from "../model/User.js";

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
  if (userName || userName.length > 0) {
    return res.status(400).json('User with this username already exists');
  }
  const userEmail = await User.find({ email: req.body.email });
  if (userEmail || userEmail.length > 0) {
    return res.status(400).json('User with this email already exists');
  }

  const salt = process.env.HASH;
  const securePassword = bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: securePassword
    })

    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);

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
  const user = await User.find({ email: req.body.email });
  if (!user || user.length < 0) {
    return res.status(404).json('User not found');
  }


  try {
    const securePassword = await bcrypt.compare(req.body.password, user.password);
    if (!securePassword) {
      return res.status(401).json('Wrong password');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}