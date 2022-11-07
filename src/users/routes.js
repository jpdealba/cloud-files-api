const router = require("express").Router();
const controller = require("./controller");

router.post("/", controller.postOne);
router.get("/:query", controller.getByQuery);
router.get("/", controller.getList);

module.exports = router;
