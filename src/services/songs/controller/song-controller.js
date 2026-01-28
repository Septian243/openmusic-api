import SongRepositories from '../repositories/song-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const addSong = async (req, res, next) => {
  try {
    const { title, year, genre, performer, duration, albumId } = req.validated;
    const song = await SongRepositories.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    });

    if (!song) {
      return next(new InvariantError('Lagu gagal ditambahkan'));
    }

    return response(res, 201, 'success', 'Lagu berhasil ditambahkan', { songId: song.id });
  } catch (error) {
    return next(error);
  }
};

export const getAllSongs = async (req, res, next) => {
  try {
    const { title, performer } = req.query;
    const songs = await SongRepositories.getAllSongs({ title, performer });
    return response(res, 200, 'success', null, { songs });
  } catch (error) {
    return next(error);
  }
};

export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await SongRepositories.getSongById(id);

    if (!song) {
      return next(new NotFoundError('Lagu tidak ditemukan'));
    }

    return response(res, 200, 'success', null, { song });
  } catch (error) {
    return next(error);
  }
};

export const editSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, year, genre, performer, duration, albumId } = req.validated;

    const song = await SongRepositories.editSongById({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId
    });

    if (!song) {
      return next(new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan'));
    }

    return response(res, 200, 'success', 'Lagu berhasil diperbarui');
  } catch (error) {
    return next(error);
  }
};

export const deleteSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSong = await SongRepositories.deleteSongById(id);

    if (!deletedSong) {
      return next(new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan'));
    }

    return response(res, 200, 'success', 'Lagu berhasil dihapus');
  } catch (error) {
    return next(error);
  }
};