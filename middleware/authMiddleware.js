// File: /middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../schema/userModel";


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) throw new Error("User not found");

      next();
    } catch (err) {
      console.error("Auth error:", err.message);
      res.status(401).json({ error: "Not authorized" });
    }
  } else {
    res.status(401).json({ error: "Token missing" });
  }
};

export default protect;
