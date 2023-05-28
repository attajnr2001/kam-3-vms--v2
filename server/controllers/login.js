const User = require("../../models/User")
const passport = require("passport")

exports.login = async (req, res, next) => {
  const errors = [];
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    passport.authenticate("user-local", {
      successRedirect: `/users/${user._id}`,
      failureRedirect: `/`,
      failureFlash: true, 
    })(req, res, next);
  } catch (error) {
    errors.push({ msg: "No user found" });
  }
};
