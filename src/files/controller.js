const FilesModel = require("./model");

class FilesController {
  getAll(req, res) {
    const File = new FilesModel();
    const user_id = req.params.user_id;
    File.findAll(user_id).then((resp) => {
      res.send(resp);
    });
  }

  getOne(req, res) {
    const File = new FilesModel();
    const file_id = req.params.file_id;
    File.findOne(file_id).then((resp) => {
      res.send(resp);
    });
  }

  getAllCreated(req, res) {
    const File = new FilesModel();
    const user_id = req.params.user_id;
    File.findAllCreated(user_id).then((resp) => {
      res.send(resp);
    });
  }
  postFile(req, res) {
    const File = new FilesModel();
    const body = req.body;
    File.createOne(req.file, body).then((resp) => {
      res.send(resp);
    });
  }
}

module.exports = new FilesController();
