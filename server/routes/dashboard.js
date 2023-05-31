const router = require("express").Router();
const controller = require("../controllers/dashboard");
const { ensureAuthenticated  } = require("../../config/auth");

/*get dashboard route */
router.get("/:_id", ensureAuthenticated,  controller.dashboard);

/*get new Customer route */
router.get("/:_id/newCustomer",ensureAuthenticated, controller.newCustomer);

/*get view Customer route */
router.get("/:_id/customer/:customerId",ensureAuthenticated, controller.viewCustomer);

/*get edit Customer route */
router.get("/:_id/customer/:customerId/edit",ensureAuthenticated, controller.editCustomer);

/* delete Customer */
router.post("/:_id/customer/:customerId/delete",ensureAuthenticated, controller.deleteCustomer);

/*get new vehicle route */
router.get("/:_id/newVehicle",ensureAuthenticated, controller.newVehicle);

/*get edit vehicle route */
router.get("/:_id/vehicle/:vehicleId",ensureAuthenticated, controller.viewVehicle);

/*get edit Vehicle route */
router.get("/:_id/vehicle/:vehicleId/edit",ensureAuthenticated, controller.editVehicle);

/*get new Staff route */
router.get("/:_id/newStaff",ensureAuthenticated, controller.newStaff);

/*get view staff route */
router.get("/:_id/user/:userId",ensureAuthenticated, controller.viewUser);

/*get edit staff route */
router.get("/:_id/user/:userId/edit",ensureAuthenticated, controller.editUser);

/*get profile */
router.get("/:_id/profile",ensureAuthenticated,  controller.profile);

/*edit profile */
router.post("/:_id/profile",ensureAuthenticated,  controller.editProfile);

/*get  logout route */
router.get("/:_id/logout",ensureAuthenticated,  controller.logout);

/*get  logout route */
router.get("/:_id/messages",ensureAuthenticated,  controller.messages);

module.exports = router;
