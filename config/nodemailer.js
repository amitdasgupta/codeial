const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "", // generated ethereal user
    pass: "" // generated ethereal password
  }
});

let renderTemplate = (data, relativePath) => {
  let mainHtml;
  ejs.renderFile(
    path.join(__dirname, "../view/mailers", relativePath),
    data,
    function(err, template) {
      console.log(template);
      if (err) {
        console.log("error in displaying template", err);
        return;
      }
      mainHtml = template;
    }
  );
  return mainHtml;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate
};
