module.exports = function(req, res, next) {
    const { firstname, lastname, email, password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      if (![email, firstname, lastname, password].every(Boolean)) {
        return res.status(400).json({ msg: "Missing Credentials" });
      } else if (!validEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(400).json({ msg: "Missing Credentials" });
      } else if (!validEmail(email)) {
        return res.status(400).json({ msg: "Invalid Email" });
      }
    }
  
    next();
  };
  