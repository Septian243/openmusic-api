import CollaborationRepositories from '../repositories/collaboration-repositories.js';
import PlaylistRepositories from '../../playlists/repositories/playlist-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import { InvariantError, NotFoundError, AuthorizationError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const addCollaboration = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.validated;
    const { userId: ownerId } = req.auth;

    const verification = await PlaylistRepositories.verifyPlaylistOwner(playlistId, ownerId);

    if (!verification.exists) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    if (!verification.isOwner) {
      return next(new AuthorizationError('Anda tidak berhak menambahkan kolaborator'));
    }

    const user = await UserRepositories.getUserById(userId);

    if (!user) {
      return next(new NotFoundError('User tidak ditemukan'));
    }

    const collaboration = await CollaborationRepositories.addCollaboration(playlistId, userId);

    if (!collaboration) {
      return next(new InvariantError('Kolaborasi gagal ditambahkan'));
    }

    return response(res, 201, 'success', 'Kolaborasi berhasil ditambahkan', { collaborationId: collaboration.id });

  } catch (error) {
    if (error.code === '23505') {
      return next(new InvariantError('Kolaborasi sudah ada'));
    }

    return next(error);
  }
};

export const deleteCollaboration = async (req, res, next) => {
  try {
    const { playlistId, userId } = req.validated;
    const { userId: ownerId } = req.auth;

    const verification = await PlaylistRepositories.verifyPlaylistOwner(playlistId, ownerId);

    if (!verification.exists) {
      return next(new InvariantError('Playlist tidak ditemukan'));
    }

    if (!verification.isOwner) {
      return next(new AuthorizationError('Anda tidak berhak menambahkan kolaborator'));
    }

    const deleteCollaboration = await CollaborationRepositories.deleteCollaboration(playlistId, userId);

    if (!deleteCollaboration) {
      return next(new InvariantError('Kolaborasi gagal dihapus'));
    }

    return response(res, 200, 'success', 'Kolaborasi berhasil dihapus');

  } catch (error) {
    return next(error);
  }
};