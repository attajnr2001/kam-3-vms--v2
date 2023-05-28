const router = require("express").Router();
const controller = require("../controllers/dashboard");


/*get dashboard route */
router.get("/:_id", controller.dashboard);

/*get new Customer route */
router.get("/:_id/newCustomer", controller.newCustomer);

/*get view Customer route */
router.get("/:_id/customer/:customerId", controller.viewCustomer);

/*get edit Customer route */
router.get("/:_id/customer/:customerId/edit", controller.editCustomer);

/* delete Customer */
router.post("/:_id/customer/:customerId/delete", controller.deleteCustomer)


/*get new vehicle route */
router.get("/:_id/newVehicle", controller.newVehicle)

/*get edit vehicle route */
router.get("/:_id/vehicle/:vehicleId", controller.viewVehicle)

/*get edit Vehicle route */
router.get("/:_id/vehicle/:vehicleId/edit", controller.editVehicle);


/*get new Staff route */
router.get("/:_id/newStaff", controller.newStaff);

/*get view staff route */
router.get("/:_id/user/:userId", controller.viewUser);

/*get edit staff route */
router.get("/:_id/user/:userId/edit", controller.editUser);

/*get profile */
router.get("/:_id/profile", controller.profile);

/*edit profile */
router.post("/:_id/profile", controller.editProfile);



module.exports = router;
