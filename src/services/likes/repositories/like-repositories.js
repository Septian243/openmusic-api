import { Pool } from "pg";
import { nanoid } from "nanoid";

class LikeRepositories {
    constructor() {
        this.pool = new Pool()
    }

    async likeAlbum(userId, albumId) {
        const id = `like-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId]
        }

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async unLikeAlbum(userId, albumId) {
        const query = {
            text: 'DELETE INTO user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId]
        }

        const result = await this.pool.query(query);
        return result.rows[0];
    }

    async checkUserLikedAlbum(userId, albumId) {
        const query = {
            text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId]
        }

        const result = await this.pool.query(query);
        return result.rows.length > 0;
    }

    async getAlbumLikeCount(albumId) {
        const query = {
            text: 'SELECT COUNT(*)::int as count FROM user_album_likes WHERE album_id = $1',
            values: [albumId]
        }

        const result = await this.pool.query(query);
        return result.rows[0].count;
    }

    async verifyAlbumExists(albumId) {
        const query = {
            text: 'SELECT id FROM albums WHERE id = $1',
            values: [albumId]
        }

        const result = await this.pool.query(query);
        return result.rows.length > 0;
    }
}

export default new LikeRepositories();