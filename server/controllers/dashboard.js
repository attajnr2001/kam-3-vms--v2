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

  setInterval(checkMssgs, 8.64e+7);

  let searchQuery = req.query.search;
  if (searchQuery) {
    customers = customers.filter(
      (elt) =>
        elt.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        elt.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  res.render("dashboard", {
    user: user,
    users: users,
    customers: customers,
    vehicles: vehicles,
    search: searchQuery,
  });
};

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

/* get new Customer route */
exports.newCustomer = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const customers = await Customer.find();
  res.render("customer/new", {
    user: user,
    customers: customers,
  });
};

/* get view Customer route */
exports.viewCustomer = async (req, res) => {
  const { _id, customerId } = req.params;
  const user = await User.findById({ _id: _id });
  const customer = await Customer.findById({ _id: customerId });
  const vehicle = await Vehicle.find({});
  res.render("customer/view", {
    user: user,
    customer: customer,
    vehicle: vehicle,
  });
};

/* get edit Customer route */
exports.editCustomer = async (req, res) => {
  const { _id, customerId } = req.params;
  const user = await User.findById({ _id: _id });
  const customer = await Customer.findById({ _id: customerId });
  res.render("customer/edit", {
    user: user,
    customer: customer,
  });
};

/* delete Customer route */
exports.deleteCustomer = async (req, res) => {
  try {
    const { _id, customerId } = req.params;
    const customer = await Customer.findById(customerId);

    customer.status = "inactive";
    await customer.save();
    res.redirect(`/users/${_id}`);
  } catch (error) {
    console.log(error);
  }
};

/* vehicle */

/* get new Vehicle route */
exports.newVehicle = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  const customers = await Customer.find();
  const vehicle = await Vehicle.find();
  res.render("vehicle/new", {
    user: user,
    customers: customers,
    vehicle: vehicle,
  });
};

/* get view Vehicle route */
exports.viewVehicle = async (req, res) => {
  const { _id, vehicleId } = req.params;
  const user = await User.findById({ _id: _id });
  const vehicle = await Vehicle.findById({ _id: vehicleId });
  const owner = await Customer.findById({ _id: vehicle.owner });
  res.render("vehicle/view", {
    user: user,
    owner: owner,
    vehicle: vehicle,
  });
};

/* get edit Vehicle route */
exports.editVehicle = async (req, res) => {
  const { _id, vehicleId } = req.params;
  const user = await User.findById({ _id: _id });
  const vehicle = await Vehicle.findById({ _id: vehicleId });
  const owner = await Customer.findById({ _id: vehicle.owner });
  const customers = await Customer.find();
  res.render("vehicle/edit", {
    user: user,
    owner: owner,
    vehicle: vehicle,
    customers: customers,
  });
};

/* get new Staff route */
exports.newStaff = async (req, res) => {
  const { _id, vehicleId } = req.params;
  const user = await User.findById({ _id: _id });
  console.log(user);
  const users = await User.find();
  res.render("user/new", {
    user: user,
    users: users,
  });
};

/* get view User route */
exports.viewUser = async (req, res) => {
  const { _id, userId } = req.params;
  const user = await User.findById({ _id: _id });
  const _user = await User.findById({ _id: userId });
  res.render("user/view", {
    user: user,
    _user: _user,
  });
};

/* get edit Customer route */
exports.editUser = async (req, res) => {
  const { _id, userId } = req.params;
  const user = await User.findById({ _id: _id });
  const _user = await User.findById({ _id: userId });
  res.render("user/edit", {
    user: user,
    _user: _user,
  });
};

/* get profile route */
exports.profile = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  res.render("user/profile", {
    user: user,
  });
};

/* get profile route */
exports.editProfile = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById({ _id: _id });
  let errors = [];

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

      res.redirect(`/users/${_id}`);
    } catch (error) {
      console.log(error);
    }
  }
};
