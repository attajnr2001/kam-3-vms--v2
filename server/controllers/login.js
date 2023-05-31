const User = require("../../models/User")
const passport = require("passport")

/* get login route */
exports.login = async (req, res, next) => {
  const errors = [];
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if(user.status === "active"){
      passport.authenticate("user-local", {
        successRedirect: `/users/${user._id}`,
        failureRedirect: `/`,
        failureFlash: true, 
      })(req, res, next);
    }
    else{
      res.render("login")
    }
  } catch (error) {
    errors.push({ msg: "No user found" });
  }
};
