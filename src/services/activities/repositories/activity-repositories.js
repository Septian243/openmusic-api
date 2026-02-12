import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class ActivityRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities(id, playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
                   FROM playlist_song_activities psa
                   INNER JOIN users u ON psa.user_id = u.id
                   INNER JOIN songs s ON psa.song_id = s.id
                   WHERE psa.playlist_id = $1
                   ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }
}

export default new ActivityRepositories();