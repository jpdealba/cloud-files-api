const router = require("express").Router();
const controller = require("./controller");

router.post("/", controller.postOne);
router.get("/:query", controller.getByQuery);

module.exports = router;
