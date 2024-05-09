const User = require("../Models/UserRegistration");

const isuser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
if(password === user.password){
    next();
}
else{
    res.send('invalid Email or password');
}
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {isuser};
