const express = require("express");
const cookieParser = require("cookie-parser");
const port = 8000;
const app = express();
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const mongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// setup the chat server to be used with SocketIO.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_socket").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is running on port 5000");

// scss setup code this is
app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css"
  })
);

// this is used to serve post request
app.use(express.urlencoded());

app.use(cookieParser());

// to link assets folder
app.use(express.static("./assets"));

// make the upload path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

// this is putted here so that routes can know layout they are going to use
app.use(expressLayouts);
// this is done to move all styles and script at the top(extract style and script from sub pages into layout)
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./view");

// this code is part of passportjs and express-session
app.use(
  session({
    name: "codeial",
    //TODO : change secret key before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100
    },
    store: new mongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled"
      },
      function(err) {
        console.log(err || "connect-mongodb setup ok");
      }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
// use express router
app.use("/", require("./routes"));

app.listen(port, function(err) {
  if (err) {
    console.log(`error ocuured: ${err}`);
    return;
  }
  console.log(`server running at port:${port}`);
});
