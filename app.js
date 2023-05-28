require("dotenv/config");
const express = require("express");
const app = express();
const port = process.env.port;
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const loginRouter = require("./server/routes/login");
const dashboardRouter = require("./server/routes/dashboard");
const newRouter = require("./server/routes/new");
const editRouter = require("./server/routes/edit");

/* export passport function */
require("./config/passport")(passport);

/** middlewares  */
app.use(layouts);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 

/* view engine */
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

/* database connection */
const db = process.env.MongoUri;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

/* session */
app.use(
  session({
    secret: "secret", // Secret used to sign the session ID cookie
    resave: true,
    saveUninitialized: true,
  })
);

/* initialize passport */
app.use(passport.initialize());
app.use(passport.session());

/* connect flash */
app.use(flash());

/* using flash to display messages */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

/* First route */
app.get("", (req, res) => {
  res.render("login");
});

/* router middlewares */
app.use("/", loginRouter);
app.use("/users", dashboardRouter);
app.use("/users/new", newRouter);
app.use("/users/edit", editRouter);

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
