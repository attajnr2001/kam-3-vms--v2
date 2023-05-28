const router = require("express").Router();
const controller = require("../controllers/edit");

/* edit customer */
router.post("/:_id/editCustomer/:customerId", controller.editCustomer);

/* edit vehicle */
router.post("/:_id/editVehicle/:vehicleId", controller.editVehicle);

/* edit user */
router.post("/:_id/editUser/:userId", controller.editUser);

module.exports = router;
