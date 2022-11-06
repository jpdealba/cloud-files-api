const router = require("express").Router();

const userRoutes = require("./users/routes");
const filesRoutes = require("./files/routes");

router.use("/users", userRoutes);
router.use("/files", filesRoutes);

module.exports = router;
