const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { handleEx } = require("../../helper/handle_ex");
const { User, sequelize } = require("../../models");
const { validate } = require("../../helper/validator");
const { sendEmail, renderTemplate } = require("../../helper/email");
const moment = require("moment");
var fs = require("fs");

const postUserRule = {
  firstName: "required|string",
  lastName: "required|string",
  email: "required|email",
  phone: "string",
};

module.exports = async (req, res) => {
  validate(postUserRule, req.body, res);

  const hash = uuidv4();
  const link = hash + "|" + moment().add(7, "days").unix();
  const buff = new Buffer.from(link);
  const base64data = buff.toString("base64");
  const userOps = req.body;
  userOps.resetHash = hash;
  userOps.password = null;
  const t = await sequelize.transaction();
  try {
    let getUser = await User.findOne({
      where: {
        email: { [Op.like]: userOps.email },
      },
    });
    userOps.email.toLowerCase();

    getUser = null;

    if (getUser != null)
      return res.status(400).json({ error: "User already exists" });
    else {
      const user = await User.create(userOps, { transaction: t });
      if (req.body.departments)
        user.depapartments = await user.setDepartments(req.body.departments, {
          transaction: t,
        });
      await t.commit();

      delete user.dataValues.deletedAt;
      delete user.dataValues.password;
      const findUser = await User.findOne({
        attributes: User.basicAttributes(),
        where: { id: user.id },
      });
      console.log({
        name: process.env.CLIENT_NAME,
        email: process.env.CLIENT_EMAIL,
      });

      const html = renderTemplate("invite", [
        ["{{clientName}}", process.env.CLIENT_NAME],
        ["{{userName}}", findUser.firstName + " " + findUser.lastName],
        ["{{user}}", findUser.firstName || findUser.lastName],
        [
          "{{link}}",
          `${process.env.BASE_URL_WEB}/create_password.php?data=${base64data}`,
        ],
        ["{{address}}", process.env.CLIENT_ADDRESS],
      ]);
      let mailSended = false;
      await sendEmail(user.email, "Your account created", html)
        .then((mail) => {
          if (mail.accepted.includes(user.email)) {
            mailSended = true;
          }
        })
        .catch((err) => {
          mailSended = false;
          console.log("MAIL ERROR = ", err);
        });

      findUser.dataValues.isMailSend = mailSended;

      res.json(findUser);
    }
  } catch (ex) {
    error = handleEx(res, ex);
    res.status(error.code).send(error.msg);
    await t.rollback();
  }
};
