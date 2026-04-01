import PlaylistRepositories from '../../playlists/repositories/playlist-repositories.js';
import RabbitMQService from '../../../utils/rabbitmq.js';
import { NotFoundError, AuthorizationError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const exportPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId;
        const targetEmail = req.body.targetEmail;
        const userId = req.auth.userId;

        if (!targetEmail) {
            return next(new InvariantError('Target email harus diisi'));
        }

        const verification = await PlaylistRepositories.verifyPlaylistOwner(
            playlistId,
            userId
        );

        if (!verification.exists) {
            return next(new NotFoundError('Playlist tidak ditemukan'));
        }

        if (!verification.isOwner) {
            return next(new AuthorizationError('Anda tidak berhak mengakses resource ini'));
        }

        const message = {
            playlistId,
            targetEmail,
        };

        await RabbitMQService.sendToQueue('export:playlist', message);

        return response(res, 201, 'Permintaan Anda sedang kami proses', null);
    } catch (error) {
        return next(error);
    }
};