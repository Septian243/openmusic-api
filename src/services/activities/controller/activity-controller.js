import ActivityRepositories from '../repositories/activity-repositories.js';
import PlaylistRepositories from '../../playlists/repositories/playlist-repositories.js';
import { NotFoundError, AuthorizationError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const getPlaylistActivities = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const playlistExists = await PlaylistRepositories.getPlaylistById(id);

    if (!playlistExists) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    const hasAccess = await PlaylistRepositories.verifyPlaylistAccess(id, userId);

    if (!hasAccess) {
      return next(new AuthorizationError('Anda tidak berhak mengakses playlist ini'));
    }

    const activities = await ActivityRepositories.getPlaylistActivities(id);

    if (!activities) {
      return next(new NotFoundError('Aktifitas tidak ditemukan'));
    }

    return response(res, 200, 'success', null, { playlistId: id, activities });

  } catch (error) {
    return next(error);
  }
};