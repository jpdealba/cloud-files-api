const model = require("./model");

class UsersController {
  getByQuery(req, res) {
    const User = new model();
    User.findByQuery(req.params.query).then((resp) => {
      console.log(resp);
      res.send(resp)
    });
  }

  postOne(req, res) {
    const User = new model();
    User.createUser(req.body).then((resp) => res.send(resp));
  }

  getList(req, res) {
    const User = new model();
    // res.send(req.body);
    User.findFromList(req.body).then((resp) => res.send(resp));
  }
}

module.exports = new UsersController();
