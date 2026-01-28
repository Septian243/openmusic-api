import AlbumRepositories from '../repositories/album-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const addAlbum = async (req, res, next) => {
  try {
    const { name, year } = req.validated;
    const album = await AlbumRepositories.addAlbum({ name, year });

    if (!album) {
      return next(new InvariantError('Album gagal ditambahkan'));
    }

    return response(res, 201, 'success', 'Album berhasil ditambahkan', { albumId: album.id });
  } catch (error) {
    return next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await AlbumRepositories.getAlbumById(id);

    if (!album) {
      return next(new NotFoundError('Album tidak ditemukan'));
    }

    const songs = await AlbumRepositories.getSongsByAlbumId(id);
    album.songs = songs;

    return response(res, 200, 'success', null, { album });
  } catch (error) {
    return next(error);
  }
};

export const editAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, year } = req.validated;

    const album = await AlbumRepositories.editAlbumById({ id, name, year });

    if (!album) {
      return next(new NotFoundError('Gagal memperbarui album. Id tidak ditemukan'));
    }

    return response(res, 200, 'success', 'Album berhasil diperbarui');
  } catch (error) {
    return next(error);
  }
};

export const deleteAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedAlbum = await AlbumRepositories.deleteAlbumById(id);

    if (!deletedAlbum) {
      return next(new NotFoundError('Album gagal dihapus. Id tidak ditemukan'));
    }

    return response(res, 200, 'success', 'Album berhasil dihapus');
  } catch (error) {
    return next(error);
  }
};