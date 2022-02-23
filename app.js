const express = require("express");
const app = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");

app.use(express.static(path.join(__dirname, "public")));

//Set View Engine
app.engine("handlebars", expressHandlebars.engine({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

//Load Routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");

//Use Routes
app.use("/", home);
app.use("/admin", admin);

app.listen(4500, () => {
  console.log(`Listening on Port 4500`);
});
