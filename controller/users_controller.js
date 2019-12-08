const User = require("../model/users");
const Reset = require("../model/resetpassword");
const fs = require("fs");
const path = require("path");
const forgotPasswordWorker = require("../workers/forgot_password_worker");
const queue = require("../config/kue");

module.exports.profile = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    return res.render("user_profile", {
      title: "Profile",
      profile_user: user
    });
  });
};

module.exports.update = async function(req, res) {
  // if(req.params.id==req.user.id){
  //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
  //         return res.redirect('back');
  //     });
  // }else{
  //     return res.status(401).send('Unauthorized');
  // }
  if (req.params.id == req.user.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err) {
        if (err) {
          console.log("**************Multer err:", err);
        }
        // console.log(req.file);
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
              // console.log("exists");
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
          }
          //    this is saving the path of the uploaded file into the avatar field of the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorized");
  }
};

// to render sign in page
module.exports.signin = function(req, res) {
  if (req.isAuthenticated()) return res.redirect("/users/profile");
  return res.render("user_sign_in", {
    title: "Codeial | Sign In"
  });
};

// to render sign up page
module.exports.signup = function(req, res) {
  if (req.isAuthenticated()) return res.redirect("/users/profile");
  return res.render("user_sign_up", {
    title: "Codeial | Sign Up"
  });
};

// get the sign up data
module.exports.create = function(req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  if (
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        console.log("error in finding user in signing up");
        return;
      }

      if (!user) {
        User.create(req.body, function(err, user) {
          if (err) {
            console.log("error in creating user");
            return;
          }
          return res.redirect("/users/sign-in");
        });
      } else return res.redirect("back");
    })
  );
};

// sign in and create the seesion for the user
module.exports.createSession = function(req, res) {
  //todo :create session
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};

module.exports.destroySession = function(req, res) {
  req.flash("success", "You have logged out");
  req.logout();
  return res.redirect("/");
};

//this is added for forgot password
module.exports.forgotPassword = function(req, res) {
  return res.render("_forgotpassword", {
    title: "Forgot Password"
  });
};

//this is added to reset password
module.exports.resetPassword = async function(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const accessToken = Math.random()
        .toString(36)
        .substring(7);
      let reset = await Reset.create({
        user: user._id,
        accessToken,
        isValid: true
      });
      if (reset) {
        reset = await Reset.findById(reset._id).populate("user", "-password");
        let job = queue.create("forgotpassword", reset).save(function(err) {
          if (err) {
            console.log("error in creating queue");
          }
          console.log("job enqueud", job.id);
        });
        req.flash("success", "Send mail succesfully");
      }
    } else {
      req.flash("success", "Enter valid email address");
    }
    return res.redirect("/users/forgot-password");
  } catch (error) {
    console.log("error occured:", error);
  }
};

//this is added to update password
module.exports.resetPasswordPage = async function(req, res) {
  try {
    const reset = await Reset.findOne({ accessToken: req.params.id });
    if (reset.isValid) {
      return res.render("update_password", {
        accessToken: req.params.id,
        title: "Reset Password"
      });
    }
    return res.redirect("/users/forgot-password");
  } catch (error) {
    console.log("error----------------------->", error);
  }
};

//this is added to complete post resquest of update password
module.exports.updatePassword = async function(req, res) {
  try {
    const reset = await Reset.findOne({ accessToken: req.params.id });
    if (reset.isValid && req.body.password == req.body.rpassword) {
      await User.findByIdAndUpdate(reset.user, { password: req.body.password });
      await Reset.findByIdAndUpdate(reset._id, { isValid: "false" });
    }
    return res.redirect("/");
  } catch (error) {
    console.log("error----------------------->", error);
  }
};
