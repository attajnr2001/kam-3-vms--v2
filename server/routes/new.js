const router = require("express").Router();
const controller = require("../controllers/new");


/*post new Customer route */
router.post("/:_id/newCustomer", controller.newCustomer);


/*post new Vehicle route */
router.post("/:_id/newVehicle", controller.newVehicle);


/*post new User route */
router.post("/:_id/newUser", controller.newUser);

module.exports = router;
