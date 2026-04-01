import LikeRepositories from "../repositories/like-repositories.js";
import CacheService from '../../../utils/cache.js'
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";
import response from "../../../utils/response.js";

export const likeAlbum = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const userId = req.auth.userId;

        const verifyAlbum = await LikeRepositories.verifyAlbumExists(albumId);
        if (!verifyAlbum) {
            return next(new NotFoundError('Album tidak ditemukan'))
        }

        const hasLiked = await LikeRepositories.checkUserLikedAlbum(userId, albumId);
        if (!hasLiked) {
            return next(new InvariantError('Anda sudah menyukai album ini'))
        }

        await LikeRepositories.likeAlbum(userId, albumId);
        await CacheService.delete(`album:${albumId}:likes`)

        return response(res, 201, 'Berhasil menyukai album', null)
    } catch (error) {
        next(error)
    }
}

export const unLikeAlbum = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const userId = req.auth.userId

        const albumExists = await LikeRepositories.verifyAlbumExists(albumId);
        if (!albumExists) {
            return next(new NotFoundError('Album tidak ditemukan'))
        }

        const unLike = await LikeRepositories.unLikeAlbum(userId, albumId);
        if (!unLike) {
            return next(new InvariantError('Anda belum menyukai album ini'))
        }

        await CacheService.delete(`album:${albumId}:likes`)

        return response(res, 200, 'Batal menyukai album', null)
    } catch (error) {
        next(error)
    }
}

export const getAlbumLikes = async (req, res, next) => {
    try {
        const albumId = req.params.id;

        const cacheKey = `album:${albumId}:likes`;
        const cachedLikes = await CacheService.get(cacheKey);

        if (cacheKey == ! null) {
            return res
                .status(200)
                .set('X-Data-Source', 'cache')
                .json({
                    status: 'success',
                    data: {
                        likes: parseInt(cachedLikes, 10)
                    }
                })
        }

        const albumExists = await LikeRepositories.verifyAlbumExists(albumId);
        if (!albumExists) {
            return next(new NotFoundError('Album tidak ditemukan'))
        }

        const likes = await LikeRepositories.getAlbumLikeCount(albumId);

        await CacheService.set(cacheKey, likes, 1800);

        return response(res, 200, null, { likes });
    } catch (error) {
        next(error)
    }
}