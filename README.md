# OpenMusic API

OpenMusic API adalah RESTful API untuk mengelola data album, lagu, pengguna, playlist, dan kolaborasi menggunakan Express.js, PostgreSQL, dan JWT Authentication.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Database Migration](#database-migration)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Documentation](#api-documentation)
  - [Albums](#albums-endpoints)
  - [Songs](#songs-endpoints)
  - [Users](#users-endpoints)
  - [Authentications](#authentications-endpoints)
  - [Playlists](#playlists-endpoints)
  - [Collaborations](#collaborations-endpoints)
  - [Activities](#activities-endpoints)
- [Error Handling](#error-handling)
- [Struktur Project](#struktur-project)

---

## ✨ Fitur

### Fitur Utama (Required)

- ✅ **CRUD Albums** - Mengelola data album musik
- ✅ **CRUD Songs** - Mengelola data lagu
- ✅ **User Registration** - Registrasi pengguna baru dengan username unik
- ✅ **JWT Authentication** - Login dengan access token dan refresh token
- ✅ **CRUD Playlists** - Mengelola playlist pribadi (protected resource)
- ✅ **Playlist Songs Management** - Menambah/hapus lagu ke/dari playlist
- ✅ **Data Validation** - Validasi request payload menggunakan Joi
- ✅ **Foreign Key Relations** - Relasi antar tabel menggunakan foreign key
- ✅ **Comprehensive Error Handling** - Error handling untuk 400, 401, 403, 404, 500

### Fitur Opsional

- ✅ **Playlist Collaborations** - Kolaborasi playlist dengan user lain
- ✅ **Playlist Activities** - Tracking aktivitas tambah/hapus lagu di playlist
- ✅ **Album Songs List** - Daftar lagu ditampilkan dalam detail album
- ✅ **Song Search** - Pencarian lagu berdasarkan title dan performer

---

## 🛠 Teknologi

- **Node.js** (v14+) - Runtime environment
- **Express.js** (v4.18+) - Web framework
- **PostgreSQL** (v12+) - Database
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **nanoid** - ID generator
- **node-pg-migrate** - Database migration
- **dotenv** - Environment variable management

---

## 📦 Prasyarat

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) (v14 atau lebih tinggi)
- [PostgreSQL](https://www.postgresql.org/) (v12 atau lebih tinggi)
- npm atau yarn

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Septian243/openmusic-api.git
cd openmusic-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Buat database PostgreSQL baru:

```bash
createdb openmusic
```

Atau melalui psql:

```sql
CREATE DATABASE openmusic;
```

---

## ⚙️ Konfigurasi

### 1. Environment Variables

Buat file `.env` dari template:

```bash
cp .env.example .env
```

### 2. Konfigurasi `.env`

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openmusic
PGHOST=localhost
PGPORT=5432

# JWT Configuration
ACCESS_TOKEN_KEY=your-secret-access-token-key-min-32-characters-long
REFRESH_TOKEN_KEY=your-secret-refresh-token-key-min-32-characters-long
ACCESS_TOKEN_AGE=1800
```

### 3. Generate Secure JWT Keys

Gunakan Node.js untuk generate random string:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Jalankan 2x untuk `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY`.

**PENTING:**

- Minimal 32 karakter
- Jangan commit secret keys ke repository
- Gunakan keys berbeda untuk production

---

## 🗄️ Database Migration

### Jalankan Migration

```bash
npm run migrate up
```

### Rollback Migration

```bash
npm run migrate down
```

### Struktur Database

**Tabel: albums**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| name | TEXT | NOT NULL |
| year | INTEGER | NOT NULL |

**Tabel: songs**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| title | TEXT | NOT NULL |
| year | INTEGER | NOT NULL |
| genre | TEXT | NOT NULL |
| performer | TEXT | NOT NULL |
| duration | INTEGER | NULLABLE |
| albumid | VARCHAR(50) | FK → albums(id) |

**Tabel: users**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL |
| fullname | TEXT | NOT NULL |

**Tabel: authentications**
| Column | Type | Constraint |
|--------|------|------------|
| token | TEXT | NOT NULL |

**Tabel: playlists**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| name | TEXT | NOT NULL |
| owner | VARCHAR(50) | FK → users(id) |

**Tabel: playlist_songs**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| playlist_id | VARCHAR(50) | FK → playlists(id) |
| song_id | VARCHAR(50) | FK → songs(id) |

**Tabel: collaborations**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| playlist_id | VARCHAR(50) | FK → playlists(id) |
| user_id | VARCHAR(50) | FK → users(id) |

**Tabel: playlist_song_activities**
| Column | Type | Constraint |
|--------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| playlist_id | VARCHAR(50) | FK → playlists(id) |
| song_id | VARCHAR(50) | FK → songs(id) |
| user_id | VARCHAR(50) | FK → users(id) |
| action | VARCHAR(20) | NOT NULL |
| time | TIMESTAMP | NOT NULL |

---

## 🏃 Menjalankan Aplikasi

### Development Mode (dengan auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Response Format

**Success Response:**

```json
{
  "status": "success",
  "message": "Optional message",
  "data": {}
}
```

**Error Response:**

```json
{
  "status": "fail",
  "message": "Error message"
}
```

---

## Albums Endpoints

### 1. Create Album

**Endpoint:** `POST /albums`

**Request Body:**

```json
{
  "name": "Viva la Vida",
  "year": 2008
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Album berhasil ditambahkan",
  "data": {
    "albumId": "album-Mk8AnmCp210PwT6B"
  }
}
```

**Validation:**

- `name`: string, required
- `year`: number, required

---

### 2. Get Album by ID

**Endpoint:** `GET /albums/{id}`

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "year": 2008,
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

---

### 3. Update Album

**Endpoint:** `PUT /albums/{id}`

**Request Body:**

```json
{
  "name": "Viva la Vida (Deluxe)",
  "year": 2008
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Album berhasil diperbarui"
}
```

---

### 4. Delete Album

**Endpoint:** `DELETE /albums/{id}`

**Response (200):**

```json
{
  "status": "success",
  "message": "Album berhasil dihapus"
}
```

---

## Songs Endpoints

### 1. Create Song

**Endpoint:** `POST /songs`

**Request Body:**

```json
{
  "title": "Life in Technicolor",
  "year": 2008,
  "genre": "Alternative Rock",
  "performer": "Coldplay",
  "duration": 120,
  "albumId": "album-Mk8AnmCp210PwT6B"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Lagu berhasil ditambahkan",
  "data": {
    "songId": "song-Qbax5Oy7L8WKf74l"
  }
}
```

**Validation:**

- `title`: string, required
- `year`: number, required
- `genre`: string, required
- `performer`: string, required
- `duration`: number, optional
- `albumId`: string, optional

---

### 2. Get All Songs

**Endpoint:** `GET /songs`

**Query Parameters:**

- `title` (optional): Search by song title
- `performer` (optional): Search by performer name

**Examples:**

```
GET /songs
GET /songs?title=life
GET /songs?performer=coldplay
GET /songs?title=life&performer=coldplay
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      }
    ]
  }
}
```

---

### 3. Get Song by ID

**Endpoint:** `GET /songs/{id}`

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "song": {
      "id": "song-Qbax5Oy7L8WKf74l",
      "title": "Life in Technicolor",
      "year": 2008,
      "performer": "Coldplay",
      "genre": "Alternative Rock",
      "duration": 120,
      "albumId": "album-Mk8AnmCp210PwT6B"
    }
  }
}
```

---

### 4. Update Song

**Endpoint:** `PUT /songs/{id}`

**Request Body:**

```json
{
  "title": "Life in Technicolor II",
  "year": 2008,
  "genre": "Alternative Rock",
  "performer": "Coldplay",
  "duration": 240,
  "albumId": "album-Mk8AnmCp210PwT6B"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Lagu berhasil diperbarui"
}
```

---

### 5. Delete Song

**Endpoint:** `DELETE /songs/{id}`

**Response (200):**

```json
{
  "status": "success",
  "message": "Lagu berhasil dihapus"
}
```

---

## Users Endpoints

### 1. Register User

**Endpoint:** `POST /users`

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "secret123",
  "fullname": "John Doe"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "User berhasil ditambahkan",
  "data": {
    "userId": "user-Qbax5Oy7L8WKf74l"
  }
}
```

**Validation:**

- `username`: string, required, unique
- `password`: string, required
- `fullname`: string, required

---

## Authentications Endpoints

### 1. Login (Create Authentication)

**Endpoint:** `POST /authentications`

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "secret123"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Authentication berhasil ditambahkan",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**

- `username`: string, required
- `password`: string, required

---

### 2. Refresh Access Token

**Endpoint:** `PUT /authentications`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Access Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Logout (Delete Authentication)

**Endpoint:** `DELETE /authentications`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Refresh token berhasil dihapus"
}
```

---

## Playlists Endpoints

🔒 **All playlist endpoints require authentication (Bearer Token)**

### 1. Create Playlist

**Endpoint:** `POST /playlists`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "name": "My Favorite Songs"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Playlist berhasil ditambahkan",
  "data": {
    "playlistId": "playlist-Qbax5Oy7L8WKf74l"
  }
}
```

**Validation:**

- `name`: string, required

---

### 2. Get All Playlists

**Endpoint:** `GET /playlists`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "playlists": [
      {
        "id": "playlist-Qbax5Oy7L8WKf74l",
        "name": "My Favorite Songs",
        "username": "johndoe"
      }
    ]
  }
}
```

**Note:** Hanya menampilkan playlist milik user dan playlist yang dikolaborasikan dengan user.

---

### 3. Delete Playlist

**Endpoint:** `DELETE /playlists/{id}`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Playlist berhasil dihapus"
}
```

**Authorization:** Hanya owner playlist yang dapat menghapus.

---

### 4. Add Song to Playlist

**Endpoint:** `POST /playlists/{id}/songs`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "songId": "song-Qbax5Oy7L8WKf74l"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Lagu berhasil ditambahkan ke playlist"
}
```

**Authorization:** Owner atau collaborator dapat menambahkan lagu.

---

### 5. Get Playlist Songs

**Endpoint:** `GET /playlists/{id}/songs`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist-Mk8AnmCp210PwT6B",
      "name": "My Favorite Coldplay",
      "username": "johndoe",
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        },
        {
          "id": "song-poax5Oy7L8WKllqw",
          "title": "Cemeteries of London",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

**Authorization:** Owner atau collaborator dapat melihat.

---

### 6. Delete Song from Playlist

**Endpoint:** `DELETE /playlists/{id}/songs`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "songId": "song-Qbax5Oy7L8WKf74l"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Lagu berhasil dihapus dari playlist"
}
```

**Authorization:** Owner atau collaborator dapat menghapus lagu.

---

## Collaborations Endpoints

🔒 **All collaboration endpoints require authentication**

### 1. Add Collaboration

**Endpoint:** `POST /collaborations`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "playlistId": "playlist-Qbax5Oy7L8WKf74l",
  "userId": "user-BkXy8Oy7L8WKa21p"
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Kolaborasi berhasil ditambahkan",
  "data": {
    "collaborationId": "collab-Mk8AnmCp210PwT6B"
  }
}
```

**Validation:**

- `playlistId`: string, required
- `userId`: string, required

**Authorization:** Hanya owner playlist yang dapat menambahkan kolaborator.

---

### 2. Delete Collaboration

**Endpoint:** `DELETE /collaborations`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "playlistId": "playlist-Qbax5Oy7L8WKf74l",
  "userId": "user-BkXy8Oy7L8WKa21p"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Kolaborasi berhasil dihapus"
}
```

**Authorization:** Hanya owner playlist yang dapat menghapus kolaborator.

---

## Activities Endpoints

🔒 **All activity endpoints require authentication**

### 1. Get Playlist Activities

**Endpoint:** `GET /playlists/{id}/activities`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist-Mk8AnmCp210PwT6B",
    "activities": [
      {
        "username": "johndoe",
        "title": "Life in Technicolor",
        "action": "add",
        "time": "2026-02-12T08:06:20.600Z"
      },
      {
        "username": "janedoe",
        "title": "Cemeteries of London",
        "action": "add",
        "time": "2026-02-12T08:06:39.852Z"
      },
      {
        "username": "johndoe",
        "title": "Life in Technicolor",
        "action": "delete",
        "time": "2026-02-12T08:07:01.483Z"
      }
    ]
  }
}
```

**Authorization:** Owner atau collaborator dapat melihat aktivitas.

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Description                               |
| ----------- | ----------------------------------------- |
| 200         | OK - Request berhasil                     |
| 201         | Created - Resource berhasil dibuat        |
| 400         | Bad Request - Validation error            |
| 401         | Unauthorized - Missing atau invalid token |
| 403         | Forbidden - Tidak punya akses ke resource |
| 404         | Not Found - Resource tidak ditemukan      |
| 500         | Internal Server Error - Server error      |

### Error Response Examples

**400 - Validation Error:**

```json
{
  "status": "fail",
  "message": "\"name\" is required"
}
```

**401 - Unauthorized:**

```json
{
  "status": "fail",
  "message": "Missing authentication"
}
```

**403 - Forbidden:**

```json
{
  "status": "fail",
  "message": "Anda tidak berhak mengakses resource ini"
}
```

**404 - Not Found:**

```json
{
  "status": "fail",
  "message": "Playlist tidak ditemukan"
}
```

**500 - Server Error:**

```json
{
  "status": "error",
  "message": "Maaf, terjadi kegagalan pada server kami."
}
```

---

## 📁 Struktur Project

```
openmusic-api/
├── migrations/
│   ├── 1769582000001_create-table-albums.js
│   ├── 1769582000002_create-table-songs.js
│   ├── 1770793000001_create-table-users.js
│   ├── 1770793000002_create-table-authentications.js
│   ├── 1770793000003_create-table-playlists.js
│   ├── 1770793000004_create-table-playlist-songs.js
│   ├── 1770793000005_create-table-collaborations.js
│   └── 1770793000006_create-table-playlist-activities.js
├── src/
│   ├── exceptions/
│   │   ├── client-error.js
│   │   ├── invariant-error.js
│   │   ├── not-found-error.js
│   │   ├── authentication-error.js
│   │   ├── authorization-error.js
│   │   └── index.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── validate.js
│   ├── routes/
│   │   └── index.js
│   ├── security/
│   │   └── token-manager.js
│   ├── server/
│   │   └── index.js
│   ├── services/
│   │   ├── albums/
│   │   │   ├── controller/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validator/
│   │   ├── songs/
│   │   │   ├── controller/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validator/
│   │   ├── users/
│   │   │   ├── controller/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validator/
│   │   ├── authentications/
│   │   │   ├── controller/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validator/
│   │   ├── playlists/
│   │   │   ├── controller/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validator/
│   │   ├── collaborations/
│   │   │   ├── controller/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   └── validator/
│   │   └── activities/
│   │       ├── controller/
│   │       ├── repositories/
│   │       └── routes/
│   ├── utils/
│   │   └── response.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Penjelasan Struktur:

- **migrations/**: File-file database migration
- **src/exceptions/**: Custom error classes
- **src/middlewares/**: Express middlewares (auth, error handler, validation)
- **src/routes/**: Route definitions
- **src/security/**: Security utilities (JWT token management)
- **src/server/**: Express app configuration
- **src/services/**: Business logic (controller, repository, routes, validator)
- **src/utils/**: Utility functions (response formatter)
