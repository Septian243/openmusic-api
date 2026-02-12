import UserRepositories from '../repositories/user-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';

export const addUser = async (req, res, next) => {
  try {
    const { username, password, fullname } = req.validated;

    const user = await UserRepositories.addUser({ username, password, fullname });

    if (!user) {
      return next(new InvariantError('User gagal ditambahkan'));
    }

    return response(res, 201, 'success', 'User berhasil ditambahkan', { userId: user.id });
  } catch (error) {
    return next(error);
  }
};