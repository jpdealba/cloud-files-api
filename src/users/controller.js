const model = require("./model");

class UsersController {
  getByQuery(req, res) {
    res.send("llegaste al endpoint de users");
  }

  postOne(req, res) {
    const User = new model();
    User.createUser(req.body).then((resp) => res.send(resp));
  }
}

module.exports = new UsersController();
