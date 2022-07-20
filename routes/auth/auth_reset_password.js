const { v4: uuidv4 } = require("uuid");
const { handleEx } = require("../../helper/handle_ex");
const { sendEmail, renderTemplate } = require("../../helper/email");
const { validate } = require("../../helper/validator");
const { User } = require("../../models");
const moment = require("moment");

const resetPasswordRule = {
  email: "required|email",
};

module.exports = async (req, res) => {
  validate(resetPasswordRule, req.body, res);
  const { email } = req.body;
  let user = await User.findOne({
    attributes: User.allAttributes(),
    where: [{ email: email }],
  });

  if (!user) res.status(422).send({ error: "Invalid details provided" });
  else {
    const hash = uuidv4();
    const link = hash + "|" + moment().add(7, "days").unix();
    const buff = new Buffer.from(link);
    const base64data = buff.toString("base64");
    user.password = null;
    user.resetHash = hash;
    console.log(base64data);

    const html = renderTemplate("password_reset", [
      ["{{clientName}}", process.env.CLIENT_NAME],
      ["{{userName}}", user.firstName + " " + user.lastName],
      ["{{user}}", user.firstName || user.lastName],
      [
        "{{link}}",
        `${process.env.BASE_URL_WEB}/create_password.php/${base64data}`,
      ],
      ["{{address}}", process.env.CLIENT_ADDRESS],
    ]);

    user
      .save()
      .then(async (c) => {
        let mailSended = false;
        await sendEmail(user.email, "Password reset requested", html)
          .then((mail) => {
            if (mail.accepted.includes(user.email)) {
              mailSended = true;
            }
          })
          .catch((err) => {
            mailSended = false;
            console.log("MAIL ERROR = ", err);
          });
        res.status(202).send({ isMailSended: mailSended });
      })
      .catch((ex) => {
        error = handleEx(res, ex);
        res.status(error.code).send(error.msg);
      });
  }
};
