module.exports = {
    checkAuthenticated: function(req, res, next) {
      console.log(req);
      if (req.isAuthenticated()) {
        res.json({isLoggedIn: true})
        return next();
      }
      res.json({isLoggedIn: false});
    },
    checkNotAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');      
    }
  };