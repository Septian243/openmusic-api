import AlbumRepositories from '../../albums/repositories/album-repositories.js';
import StorageService from '../../../utils/storage.js';
import { NotFoundError, InvariantError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import { nanoid } from 'nanoid';
import path from 'path';

export const uploadAlbumCover = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const file = req.file;

        if (!file) {
            return next(new InvariantError('Gagal menambahkan cover album. File tidak ada'));
        }

        const album = await AlbumRepositories.getAlbumById(albumId);
        if (!album) {
            return next(new NotFoundError('Gagal menambahkan cover album. Id album tidak ditemukan'));
        }

        const oldCoverUrl = await AlbumRepositories.getAlbumCoverUrl(albumId);
        if (!oldCoverUrl) {
            const oldFilename = path.basename(oldCoverUrl);
            await StorageService.deleteFile(oldFilename).catch(() => { })
        }

        const ext = path.extname(file.originalname);
        const filename = `${nanoid(16)}${ext}`;

        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer);

        await StorageService.writeFile(bufferStream, filename);

        const coverUrl = StorageService.getFileUrl(filename);
        await AlbumRepositories.updateAlbumCover(albumId, coverUrl);

        return response(res, 201, 'Cover album berhasil ditambahkan', null);
    } catch (error) {
        return next(error);
    }
}