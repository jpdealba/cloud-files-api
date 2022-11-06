const router = require("express").Router();
const processFileMiddleware = require("../../middleware/upload");
const controller = require("./controller");

router.post("/", processFileMiddleware, controller.postOne);
router.get("/:query", controller.getByQuery);

module.exports = router;
