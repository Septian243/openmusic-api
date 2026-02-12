import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class PlaylistRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getPlaylists(userId) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
                   FROM playlists p
                   LEFT JOIN users u ON p.owner = u.id
                   WHERE p.owner = $1
                   UNION
                   SELECT p.id, p.name, u.username
                   FROM playlists p
                   LEFT JOIN collaborations c ON p.id = c.playlist_id
                   LEFT JOIN users u ON p.owner = u.id
                   WHERE c.user_id = $1`,
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      return { exists: false, isOwner: false };
    }

    const { owner } = result.rows[0];
    return { exists: true, isOwner: owner === userId };
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const ownerQuery = {
      text: 'SELECT id FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, userId],
    };

    const ownerResult = await this.pool.query(ownerQuery);

    if (ownerResult.rows.length > 0) {
      return true;
    }

    const collaboratorQuery = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const collaboratorResult = await this.pool.query(collaboratorQuery);

    return collaboratorResult.rows.length > 0;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs(id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT p.id, p.name, u.username 
                   FROM playlists p
                   LEFT JOIN users u ON p.owner = u.id
                   WHERE p.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this.pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      return null;
    }

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer
                   FROM songs s
                   INNER JOIN playlist_songs ps ON s.id = ps.song_id
                   WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this.pool.query(songsQuery);

    return {
      ...playlistResult.rows[0],
      songs: songsResult.rows,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifySongExists(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this.pool.query(query);
    return result.rows.length > 0;
  }
}

export default new PlaylistRepositories();