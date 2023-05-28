const User = require("../../models/User");
const Customer = require("../../models/Customer");
const Vehicle = require("../../models/Vehicle");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

/* new Customer */
exports.newCustomer = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const customers = await Customer.find();
  let errors = [];

  try {
    const response = await axios.get("http://worldtimeapi.org/api/ip");
    const { utc_datetime } = response.data;

    const customer = await new Customer({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      whatsapp: req.body.whatsapp,
      company: req.body.company,
      dob: req.body.dob,
      gender: req.body.gender,
      lClass: req.body.lClass,
      lNo: req.body.lNo,
      refNo: req.body.refNo,
      issueDate: req.body.issueDate,
      nextRenewal: req.body.nextRenewal,
      lExpiry: req.body.lExpiry,
      createdAt: utc_datetime,
    });

    saveCover(customer, req.body.cover);

    try {
      const newCustomer = await customer.save();
      res.redirect(`/users/${_id}`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    errors.push({ msg: "Something went wrong" });
    res.render("customer/new");
    console.log(error);
  }
};

function saveCover(customer, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    customer.coverImage = new Buffer.from(cover.data, "base64");
    customer.coverImageType = cover.type;
  }
}

/* new Vehicle */
exports.newVehicle = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const customers = await Customer.find();
  let errors = [];

  try {
    const response = await axios.get("http://worldtimeapi.org/api/ip");
    const { utc_datetime } = response.data;

    const vehicle = await new Vehicle({
      owner: req.body.owner,
      number: req.body.number,
      name: req.body.name,
      color: req.body.color,
      rwStart: req.body.rwStart,
      rwRenew: req.body.rwRenew,
      insType: req.body.insType,
      insCompany: req.body.insCompany,
      use: req.body.use,
      createdAt: utc_datetime,
    });

    try {
      // Save the new vehicle to the database
      const newVehicle = await vehicle.save();
      res.redirect(`/users/${_id}`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.newUser = async (req, res) => {

   const { _id } = req.params;
   
let errors = [];

  const {
    firstName,
    lastName,
    email,
    password2,
    password,
    phone,
    dob,
    userRole,
  } = req.body;

  if (password !== password2) {
    errors.push({ msg: "passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "password must be more than 6 letters" });
  }

  if (errors.length > 0) {
    res.render(`user/new`, {
      title: "KAM 3 VMS",
      firstName,
      lastName,
      email,
      password2,
      password,
      phone,
      dob,
      userRole,
      errors,
    });
  }else{
    User.findOne({ email: email }).then(async (user) => {
      if (user) {
        errors.push({ msg: "email already exists" });
        res.render(`user/new`, {
          title: "KAM 3 VMS",
          firstName,
          lastName,
          email,
          password2,
          password,
          phone,
          dob,
          userRole,
          errors,
        });
      }else{
        try {
          const response = await axios.get("http://worldtimeapi.org/api/ip");
          const { utc_datetime } = response.data;

          const hashedPassword = await bcrypt.hash(password, 10);

          const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phone: phone,
            role: userRole,
            dob: dob,
            createdAt: utc_datetime,
          });

          await user.save();
          res.redirect(`/users/${_id}`);
          console.log("User created successfully");
        } catch (error) {
          console.log(error);
        }
      }
    })
  } 
};
