import UserRepositories from '../../users/repositories/user-repositories.js';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import tokenManager from '../../../security/token-manager.js';
import { InvariantError, AuthenticationError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.validated;

    const id = await UserRepositories.verifyUserCredential(username, password);
    if (!id) {
      return next(new AuthenticationError('Kredensial yang Anda masukkan salah'));
    }

    const accessToken = tokenManager.generateAccessToken({ userId: id });
    const refreshToken = tokenManager.generateRefreshToken({ userId: id });

    await AuthenticationRepositories.addRefreshToken(refreshToken);

    return response(res, 201, 'success', 'Authentication berhasil ditambahkan', { accessToken, refreshToken });

  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    const isTokenValid = await AuthenticationRepositories.verifyRefreshToken(refreshToken);
    if (!isTokenValid) {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    const { userId } = tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = tokenManager.generateAccessToken({ userId });

    return response(res, 200, 'success', 'Access Token berhasil diperbarui', { accessToken });

  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    const isTokenValid = await AuthenticationRepositories.verifyRefreshToken(refreshToken);
    if (!isTokenValid) {
      return next(new InvariantError('Refresh token tidak valid'));
    }

    await AuthenticationRepositories.deleteRefreshToken(refreshToken);

    return response(res, 200, 'success', 'Refresh token berhasil dihapus');

  } catch (error) {
    return next(error);
  }
};