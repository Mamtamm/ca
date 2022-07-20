const { handleEx } = require("../../helper/handle_ex");
const { sendEmail, renderTemplate } = require("../../helper/email");
const { validate } = require("../../helper/validator");
const { User } = require("../../models");
const moment = require("moment");

const passwordRule = {
  password: "required",
  hash: "required",
};

module.exports = async (req, res) => {
  validate(passwordRule, req.body, res);
  const isBase64 = (str) => {
    var base64Matcher = new RegExp(
      "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$"
    );

    return base64Matcher.test(str) ? true : false;
  };
  const { password } = req.body;
  let { hash } = req.body;

  if (isBase64(hash)) {
    let buff = new Buffer.from(hash, "base64").toString();
    const data = buff.split("|");
    hash = data[0];
    if (moment().unix() > data[1]) {
      res.status(401).send({ message: "Link expired" });
    }
  }

  let user = await User.findOne({
    attributes: User.basicAttributes(),
    where: [{ reset_hash: hash }],
  });

  if (!user)
    return res.status(401).send({ message: "Invalid details provided" });
  else {
    user.password = password;
    user.resetHash = "";

    const html = renderTemplate("create_password", [
      ["{{clientName}}", process.env.CLIENT_NAME],
      ["{{userName}}", user.firstName + " " + user.lastName],
      ["{{user}}", user.firstName || user.lastName],
      ["{{address}}", process.env.CLIENT_ADDRESS],
    ]);
    let mailSended = false;
    await sendEmail(user.email, "Your PassWord Was Created", html)
      .then((mail) => {
        if (mail.accepted.includes(user.email)) {
          mailSended = true;
        }
      })
      .catch((err) => {
        mailSended = false;
        console.log("MAIL ERROR = ", err);
      });

    user
      .save()
      .then(async (c) => {
        return res.status(202).send({ isMailSended: mailSended });
      })
      .catch((ex) => {
        error = handleEx(res, ex);
        return res.status(error.code).send(error.msg);
      });
  }
};
