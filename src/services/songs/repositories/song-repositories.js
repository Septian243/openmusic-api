import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class SongRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs(id, title, year, genre, performer, duration, albumid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllSongs({ title, performer }) {
    let queryText = 'SELECT id, title, performer FROM songs WHERE 1=1';
    const queryValues = [];
    let paramCount = 1;

    if (title) {
      queryText += ` AND LOWER(title) LIKE $${paramCount}`;
      queryValues.push(`%${title.toLowerCase()}%`);
      paramCount++;
    }

    if (performer) {
      queryText += ` AND LOWER(performer) LIKE $${paramCount}`;
      queryValues.push(`%${performer.toLowerCase()}%`);
      paramCount++;
    }

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, albumid as "albumId" FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editSongById({ id, title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumid = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new SongRepositories();