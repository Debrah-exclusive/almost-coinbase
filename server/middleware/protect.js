import jwt from 'jsonwebtoken';

/**
 * Middleware: protect routes — verifies JWT from HTTP-only cookie
 * Attaches decoded user { id } to req.user
 */
const protect = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid. Please log in again.',
    });
  }
};

export default protect;
