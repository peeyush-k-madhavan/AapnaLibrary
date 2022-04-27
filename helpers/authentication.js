module.exports = {
  userAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },

  adminAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role == "admin") {
        return next();
      }
    }
    res.redirect("/adminlogin");
  },
};
