import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader == null) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const token = authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized - invalid token" });
  }
  req.userId = decoded.userId;
  next();
};
