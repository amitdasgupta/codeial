const nodeMailer = require("../config/nodemailer");

// this is another way of exporting a method
exports.newResetpassword = reset => {
  let htmlString = nodeMailer.renderTemplate(
    { reset: reset },
    "/forgotpassword/forgot_password.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "",
      to: reset.user.email,
      subject: "reset password",
      html: htmlString
    },
    (err, info) => {
      if (err) {
        console.log(`Error in sending email ${err}`);
        return;
      }
      console.log("Message sent", info);
      return;
    }
  );
};
