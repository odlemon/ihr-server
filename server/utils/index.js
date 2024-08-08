import jwt from "jsonwebtoken";

const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: "none", // Prevent CSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });
};

export default createJWT;
