exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user.role;
    if (allowedRoles.includes(role)) {
      return next();
    }
    return res.status(403).json({
      message: " error, access denied ",
    });
  };
};