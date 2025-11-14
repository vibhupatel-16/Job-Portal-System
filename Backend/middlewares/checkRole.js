export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.userRole || req.user?.role || req.role || req.body.role; // ✅ req.userRole added
        //   console.log("User role in checkRole middleware:", userRole);
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
          success: false
        });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", success: false });
    }
  };
};
