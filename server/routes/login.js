const router = require("express").Router();
const controller = require("../controllers/login");

/*post login route */
router.post("/", controller.login);

module.exports = router;
