/**
 * @param request @alias req - is the request sent
 * @param response @alias res - is the response received
 */

/**
 * @User is the staff, the only people with access to the program
 * @Customer is the client
 * @Vehicle is the client resource being watched
 */
const User = require("../../models/User");
const Customer = require("../../models/Customer");
const Vehicle = require("../../models/Vehicle");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mailGen = require("mailgen");
const axios = require("axios");

/* get dashboard route */
exports.dashboard = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  let customers = await Customer.find({}).sort({ status: 1 });
  const vehicles = await Vehicle.find();
  const users = await User.find();

  // setInterval(checkMssgs, 8.64e7);

  let searchQuery = req.query.search;
  if (searchQuery) {
    customers = customers.filter(
      (elt) =>
        elt.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elt.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const messages = await getMessagesNumber();

  res.render("dashboard", {
    user: user,
    users: users,
    customers: customers,
    vehicles: vehicles,
    messages: messages,
    search: searchQuery,
  });
};

/* get new Customer route */
exports.newCustomer = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const customers = await Customer.find();
  const messages = await getMessagesNumber();
  res.render("customer/new", {
    user: user,
    customers: customers,
    messages: messages,
  });
};

/* get view Customer route */
exports.viewCustomer = async (req, res) => {
  const { _id, customerId } = req.params;
  const user = await User.findById({ _id: _id });
  const customer = await Customer.findById({ _id: customerId });
  const vehicle = await Vehicle.find({});

  const messages = await getMessagesNumber();
  res.render("customer/view", {
    user: user,
    customer: customer,
    vehicle: vehicle,
    messages: messages,
  });
};

/* get edit Customer route */
exports.editCustomer = async (req, res) => {
  const { _id, customerId } = req.params;
  const user = await User.findById({ _id: _id });
  const customer = await Customer.findById({ _id: customerId });

  const messages = await getMessagesNumber();
  res.render("customer/edit", {
    user: user,
    customer: customer,
    messages: messages,
  });
};

/* delete Customer route */
exports.deleteCustomer = async (req, res) => {
  try {
    const { _id, customerId } = req.params;
    const customer = await Customer.findById(customerId);

    customer.status = "inactive";
    await customer.save();
    req.flash("success_msg", "Customer status: inactive");
    res.redirect(`/users/${_id}`);
  } catch (error) {
    req.flash("error_msg", "Customer status was not changed");
    res.redirect(`/users/${_id}`);
  }
};

/* vehicle */

/* get new Vehicle route */
exports.newVehicle = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const customers = await Customer.find();
  const vehicle = await Vehicle.find();
  const messages = await getMessagesNumber();
  res.render("vehicle/new", {
    user: user,
    customers: customers,
    vehicle: vehicle,
    messages: messages,
  });
};

/* get view Vehicle route */
exports.viewVehicle = async (req, res) => {
  const { _id, vehicleId } = req.params;
  const user = await User.findById({ _id: _id });
  const vehicle = await Vehicle.findById({ _id: vehicleId });
  const owner = await Customer.findById({ _id: vehicle.owner });
  const messages = await getMessagesNumber();
  res.render("vehicle/view", {
    user: user,
    owner: owner,
    vehicle: vehicle,
    messages: messages,
  });
};

/* get edit Vehicle route */
exports.editVehicle = async (req, res) => {
  const { _id, vehicleId } = req.params;
  const user = await User.findById({ _id: _id });
  const vehicle = await Vehicle.findById({ _id: vehicleId });
  const owner = await Customer.findById({ _id: vehicle.owner });
  const customers = await Customer.find();
  const messages = await getMessagesNumber();
  res.render("vehicle/edit", {
    user: user,
    owner: owner,
    vehicle: vehicle,
    customers: customers,
    messages: messages,
  });
};

/* get new Staff route */
exports.newStaff = async (req, res) => {
  const { _id, vehicleId } = req.params;
  const user = await User.findById({ _id: _id });
  console.log(user);
  const users = await User.find();
  const messages = await getMessagesNumber();
  res.render("user/new", {
    user: user,
    users: users,
    messages: messages,
  });
};

/* get view User route */
exports.viewUser = async (req, res) => {
  try {
    const { _id, userId } = req.params;
    const user = await User.findById({ _id: _id });
    const _user = await User.findById({ _id: userId });
    const messages = await getMessagesNumber();

    if (user.role === "supervisor") {
      res.render("user/view", {
        user: user,
        _user: _user,
        messages: messages,
      });
    } else {
      req.flash("error_msg", "Can't view details of this user");
      res.redirect(`/users/${_id}`);
    }
  } catch (error) {
    res.redirect(`/users/${_id}`);
  }
};

/* get edit Customer route */
exports.editUser = async (req, res) => {
  try {
    const { _id, userId } = req.params;
    const user = await User.findById({ _id: _id });
    const _user = await User.findById({ _id: userId });
    const messages = await getMessagesNumber();

    if (user.role === "supervisor") {
      res.render("user/edit", {
        user: user,
        _user: _user,
        messages: messages,
      });
    } else {
      req.flash("error_msg", "Can't view details of this user");
      res.redirect(`/users/${_id}`);
    }
  } catch (error) {
    res.redirect(`/users/${_id}`);
  }
};

/* get profile route */
exports.profile = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const messages = await getMessagesNumber();
  res.render("user/profile", {
    user: user,
    messages: messages,
  });
};

/* edit profile route */
exports.editProfile = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  let errors = [];
  const messages = await getMessagesNumber();

  let { firstName, lastName, email, password2, password, phone, dob } =
    req.body;

  if (password2 != password) {
    errors.push({ msg: "Password do not match" });
  }

  let hashedPassword;
  if (password.length > 0) {
    hashedPassword = await bcrypt.hash(password, 10);
  } else {
    hashedPassword = user.password;
  }

  if (errors.length > 0) {
    res.render("user/profile", {
      errors,
      user: user,
      messages: messages,
    });
  } else {
    try {
      await User.updateOne(
        { _id: _id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phone: phone,
            dob: dob,
          },
        }
      );
      req.flash("success_msg", "Profile Updated");
      res.redirect(`/users/${_id}`);
    } catch (error) {
      req.flash("error_msg", "Profile was not Updated");
      res.redirect(`/users/${_id}/profile`);
    }
  }
};

/* post logout route */
exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) throw err;
  });
  req.flash("success_msg", "Logged out");
  res.redirect("/");
};

/* get messages route */
exports.messages = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById({ _id: _id });

    const response = await axios.get("http://worldtimeapi.org/api/ip");
    const { utc_datetime } = response.data;
    const currentDate = new Date(utc_datetime);

    const { _customers, _vehicles } = await checkMessages(currentDate);
    const messages = _vehicles.length + _customers.length;

    res.render("user/messages", {
      user: user,
      customers: _customers,
      vehicles: _vehicles,
      messages: messages,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

async function getMessagesNumber() {
  const response = await axios.get("http://worldtimeapi.org/api/ip");
  const { utc_datetime } = response.data;
  const currentDate = new Date(utc_datetime);

  const { _customers, _vehicles } = await checkMessages(currentDate);
  const messages = _vehicles.length + _customers.length;
  return messages;
}

async function checkMessages(currentDate) {
  const _customers = await Customer.find({
    $or: [
      { nextRenewal: { $lte: currentDate } },
      { lExpiry: { $lte: currentDate } },
    ],
  });

  const _vehicles = await Vehicle.find({ rwRenew: { $lte: currentDate } });
  return { _customers, _vehicles };
}

/* functions
 * check for alerts functions
 */
async function checkMssgs() {
  let customers = await Customer.find({}).sort({ status: 1 });

  const response = await axios.get("http://worldtimeapi.org/api/ip");
  const { utc_datetime } = response.data;
  const currentDate = new Date(utc_datetime).toISOString().split("T")[0];

  /* nodemailer */
  customers.forEach((elt) => {
    date = new Date(elt.issueDate).toISOString().split("T")[0];
    if (date == currentDate) {
      const email = process.env.email;
      let config = {
        service: "gmail",
        auth: {
          user: "attajnr731@gmail.com",
          pass: "sqlzbgwsvrmgdesl",
        },
      };

      let transporter = nodemailer.createTransport(config);
      let mailGenerator = new mailGen({
        theme: "cerberus",
        product: {
          name: "KAM 3 Vehicle MS",
          link: "http://localhost:9900",
        },
      });

      let response = {
        body: {
          name: "Supervisor",
          intro: "An update is needed",
          table: {
            data: [
              {
                Message: "An Update is needed",
              },
            ],
          },

          outro: "Please visit website to update to prevent further errors",
        },
      };

      let mail = mailGenerator.generate(response);
      let message = {
        from: "attajnr731@gmail.com",
        to: process.env.email,
        subject: "Alert Received",
        html: mail,
      };

      transporter
        .sendMail(message)
        .then(() => {
          console.log("message sent");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}
