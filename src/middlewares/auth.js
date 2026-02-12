import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../exceptions/index.js';

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Missing authentication');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Missing authentication');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.auth = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Token tidak valid'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token sudah kadaluarsa'));
    }
    return next(new AuthenticationError('Token tidak valid'));
  }
};

export default authenticateToken;