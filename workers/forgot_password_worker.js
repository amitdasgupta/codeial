const queue = require("../config/kue");
const forgotPasswordMailer = require("../mailers/forgot_password_mailer");
queue.process("forgotpassword", function(job, done) {
  console.log("forgot password worker is processing a job", job.data);
  forgotPasswordMailer.newResetpassword(job.data);
  done();
});
