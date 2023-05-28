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
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

/* edit Customer route */
exports.editCustomer = async (req, res) => {
  const { _id, customerId } = req.params;

  try {
    const customer = await Customer.findById({ _id: customerId });
    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.phone = req.body.phone;
    customer.whatsapp = req.body.whatsapp;
    customer.company = req.body.company;
    customer.dob = req.body.dob;
    customer.gender = req.body.gender;
    customer.lClass = req.body.lClass;
    customer.lNo = req.body.lNo;
    customer.refNo = req.body.refNo;
    customer.issueDate = req.body.issueDate;
    customer.nextRenewal = req.body.nextRenewal;
    customer.lExpiry = req.body.lExpiry;

    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(customer, req.body.cover);
    }

    await customer.save();
    res.redirect(`/users/${_id}`);
  } catch (error) {
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

/* edit vehicle route */

exports.editVehicle = async (req, res) => {
  const { _id, vehicleId } = req.params;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    vehicle.owner = req.body.owner;
    vehicle.number = req.body.number;
    vehicle.name = req.body.name;
    vehicle.color = req.body.color;
    vehicle.rwStart = req.body.rwStart;
    vehicle.rwRenew = req.body.rwRenew;
    vehicle.insType = req.body.insType;
    vehicle.insCompany = req.body.insCompany;
    vehicle.use = req.body.use;

    try {
      const newVehicle = await vehicle.save();
      res.redirect(`/users/${_id}`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.editUser = async (req, res) => {
  const { _id, userId } = req.params;

  try {
    await User.updateOne(
      { _id: userId },
      { $set: { status: req.body.status, role: req.body.role } }
    );
    res.redirect(`/users/${_id}`);
  } catch (error) {
    console.log(error);
  }
}
