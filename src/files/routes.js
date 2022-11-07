const router = require("express").Router();

const processFileMiddleware = require("../../middleware/upload");
const controller = require("./controller");

// Obtener todos los archivos en los que el ussuario esta
router.get("/user/:user_id", controller.getAll);

// Obtener archivo por ids
router.get("/:file_id", controller.getOne);

// Obtener todos los archivos que creo el usuario
router.get("/created/:user_id", controller.getAllCreated);

// Subir un archivo nuevo
router.post("/", processFileMiddleware, controller.postFile);

// Agregar usuarios al documento
router.put("/", controller.putFile);

// Agregar usuarios al documento
router.delete("/", controller.deleteFile);

module.exports = router;
