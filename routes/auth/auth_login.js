const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { validate } = require("../../helper/validator");
const { User } = require("../../models");

const loginRule = {
  email: "required|email",
  password: "required",
};

module.exports = async (req, res) => {
  validate(loginRule, req.body, res);
  const { email, password } = req.body;
  let user = await User.findOne({
    attributes: User.allAttributes(),
    where: [{ email: { [Op.like]: email.toLowerCase() } }],
  });

  if (!user) res.status(401).send({ message: "User Not Found" });
  else {
    if (user.password) {
      const match = await bcrypt.compare(password, user.password || false);
      if (!match) return res.status(401).send({ message: "Unauthenticated" });
    } else if (user.resetHash) {
      return res.status(401).send({ message: "Please Create your Password" });
    } else {
      return res.status(401).send({ message: "Unauthenticated" });
    }

    delete user.dataValues.password;
    delete user.dataValues.resetHash;

    const tokenData = user.toJSON();
    const token = jwt.sign(tokenData, process.env.JWT, { expiresIn: "24h" });
    res.json({ user: user, token: token });
  }
};
