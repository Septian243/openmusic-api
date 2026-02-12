import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/invariant-error.js';

const tokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: process.env.ACCESS_TOKEN_AGE });
  },

  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return decoded;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
};

export default tokenManager;