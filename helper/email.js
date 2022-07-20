const nodemailer = require("nodemailer");
var fs = require("fs");

exports.sendEmail = async (to, subject, html, from = null) => {
  console.log("EMAIL = ", process.env.CLIENT_EMAIL);
  console.log("PASS  = ", process.env.CLIENT_PASS);

  // let mailTransporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.CLIENT_G_EMAIL || "bhuvabhavin44@gmail.com",
  //     pass: process.env.CLIENT_G_PASS || "9904222738",
  //   },
  // });

  let mailTransporter = nodemailer.createTransport({
    pool: true,
    host: "mail.bhavinn.tk",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.CLIENT_EMAIL,
      pass: process.env.CLIENT_PASS,
    },
  });

  let mailDetails = {
    to: to,
    subject: subject,
    html: html,
  };

  return new Promise(async (resolve, reject) => {
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (!err) {
        console.log("Email sent successfully");
        resolve(data);
      } else {
        console.log("Error :", err);
        console.log("Error Occurs");
        reject(err);
      }
    });
  });
};

exports.renderTemplate = (name, vars = [], from = "email_templates") => {
  var html = "";
  try {
    html = fs.readFileSync(`${__dirname}/../${from}/${name}.html`, "utf8");
  } catch (e) {
    console.log("Error:", e.stack);
  }
  // replace templete vars
  vars.forEach((v, ind) => {
    html = html.replace(v[0], v[1]);
  });
  return html;
};

exports.renderTemplateV2 = (name, vars = [], folder = "email_templates") => {
  var html = "";
  try {
    html = fs.readFileSync(`${__dirname}/../${folder}/${name}.html`, "utf8");
  } catch (e) {
    console.log("Error:", e.stack);
  }
  // replace templete vars
  vars.forEach((v, ind) => {
    const reg = new RegExp(v[0], "g");
    html = html.replace(reg, v[1]);
  });
  return html;
};
