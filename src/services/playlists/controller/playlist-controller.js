import PlaylistRepositories from '../repositories/playlist-repositories.js';
import ActivityRepositories from '../../activities/repositories/activity-repositories.js';
import { InvariantError, NotFoundError, AuthorizationError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const addPlaylist = async (req, res, next) => {
  try {
    const { name } = req.validated;
    const { userId } = req.auth;

    const playlist = await PlaylistRepositories.addPlaylist({ name, owner: userId });

    if (!playlist) {
      return next(new InvariantError('Playlist gagal ditambahkan'));
    }

    return response(res, 201, 'success', 'Playlist berhasil ditambahkan', { playlistId: playlist.id });
  } catch (error) {
    return next(error);
  }
};

export const getPlaylists = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    const playlists = await PlaylistRepositories.getPlaylists(userId);

    return response(res, 200, 'success', null, { playlists });
  } catch (error) {
    return next(error);
  }
};

export const deletePlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const verification = await PlaylistRepositories.verifyPlaylistOwner(id, userId);

    if (!verification.exists) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    if (!verification.isOwner) {
      return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const deletedPlaylist = await PlaylistRepositories.deletePlaylistById(id);

    if (!deletedPlaylist) {
      return next(new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan'));
    }

    return response(res, 200, 'success', 'Playlist berhasil dihapus');
  } catch (error) {
    return next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.validated;
    const { userId } = req.auth;

    const playlistExists = await PlaylistRepositories.getPlaylistById(id);

    if (!playlistExists) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    const hasAccess = await PlaylistRepositories.verifyPlaylistAccess(id, userId);

    if (!hasAccess) {
      return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const songExists = await PlaylistRepositories.verifySongExists(songId);

    if (!songExists) {
      return next(new NotFoundError('Lagu tidak ditemukan'));
    }

    await PlaylistRepositories.addSongToPlaylist(id, songId);

    await ActivityRepositories.addActivity({
      playlistId: id,
      songId,
      userId,
      action: 'add',
    });

    return response(res, 201, 'success', 'Lagu berhasil ditambahkan ke playlist');
  } catch (error) {
    return next(error);
  }
};

export const getPlaylistSongs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const playlistExists = await PlaylistRepositories.getPlaylistById(id);

    if (!playlistExists) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    const hasAccess = await PlaylistRepositories.verifyPlaylistAccess(id, userId);

    if (!hasAccess) {
      return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const playlist = await PlaylistRepositories.getPlaylistSongs(id);

    if (!playlist) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    return response(res, 200, 'success', null, { playlist });
  } catch (error) {
    return next(error);
  }
};

export const deleteSongFromPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.validated;
    const { userId } = req.auth;

    const playlistExists = await PlaylistRepositories.getPlaylistById(id);

    if (!playlistExists) {
      return next(new NotFoundError('Playlist tidak ditemukan'));
    }

    const hasAccess = await PlaylistRepositories.verifyPlaylistAccess(id, userId);

    if (!hasAccess) {
      return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
    }

    const deletedSong = await PlaylistRepositories.deleteSongFromPlaylist(id, songId);

    if (!deletedSong) {
      return next(new InvariantError('Lagu gagal dihapus dari playlist'));
    }

    await ActivityRepositories.addActivity({
      playlistId: id,
      songId,
      userId,
      action: 'delete',
    });

    return response(res, 200, 'success', 'Lagu berhasil dihapus dari playlist');
  } catch (error) {
    return next(error);
  }
};