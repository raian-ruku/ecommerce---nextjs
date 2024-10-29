const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign({ id: user.user_id, email: user.user_email }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

function generateTokenAdmin(user) {
  return jwt.sign(
    {
      admin_id: user.admin_id,
      admin_email: user.admin_email,
      admin_username: user.admin_username,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken, generateTokenAdmin };
