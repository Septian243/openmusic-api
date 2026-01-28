# OpenMusic API

OpenMusic API adalah RESTful API untuk mengelola data album dan lagu menggunakan Express.js dan PostgreSQL.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Database Migration](#database-migration)
- [API Documentation](#api-documentation)
  - [Albums Endpoints](#albums-endpoints)
  - [Songs Endpoints](#songs-endpoints)
- [Error Handling](#error-handling)
- [Struktur Project](#struktur-project)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Fitur

- ✅ CRUD operations untuk Albums
- ✅ CRUD operations untuk Songs
- ✅ Data validation menggunakan Joi
- ✅ Error handling yang komprehensif
- ✅ Database PostgreSQL dengan migration
- ✅ Query parameter untuk pencarian lagu (berdasarkan title dan performer)
- ✅ Relasi antara Album dan Song
- ✅ Menampilkan daftar lagu dalam detail album

## 🛠 Teknologi

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **node-pg-migrate** - Database migration tool
- **Joi** - Data validation
- **nanoid** - ID generator
- **dotenv** - Environment variable management

## 📦 Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

- [Node.js](https://nodejs.org/) (v14 atau lebih tinggi)
- [PostgreSQL](https://www.postgresql.org/) (v12 atau lebih tinggi)
- npm atau yarn

## 🚀 Instalasi

1. **Clone repository**

```bash
git clone
cd openmusic-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup database**

Buat database PostgreSQL baru:

```bash
createdb openmusicapp
```

Atau melalui psql:

```sql
CREATE DATABASE openmusicapp;
```

## ⚙️ Konfigurasi

1. **Buat file `.env`**

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

2. **Atur environment variables**

Edit file `.env` dengan konfigurasi Anda:

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openmusicapp
PGHOST=localhost
PGPORT=5432
```

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run start
```

Server akan berjalan di `http://localhost:5000`

## 🗄️ Database Migration

### Menjalankan Migration

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
|----------|------|------------|
| id | VARCHAR(50) | PRIMARY KEY |
| title | TEXT | NOT NULL |
| year | INTEGER | NOT NULL |
| genre | TEXT | NOT NULL |
| performer | TEXT | NOT NULL |
| duration | INTEGER | NULLABLE |
| albumid | VARCHAR(50) | FOREIGN KEY → albums(id) |

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Response Format

Semua response mengikuti format berikut:

**Success Response:**

```json
{
  "status": "success",
  "message": "string (optional)",
  "data": {}
}
```

**Error Response:**

```json
{
  "status": "fail",
  "message": "error message"
}
```

---

## Albums Endpoints

### 1. Create Album

Menambahkan album baru.

**Endpoint:** `POST /albums`

**Request Body:**

```json
{
  "name": "Viva la Vida",
  "year": 2008
}
```

**Response (201 - Created):**

```json
{
  "status": "success",
  "message": "Album berhasil ditambahkan",
  "data": {
    "albumId": "album-Mk8AnmCp210PwT6B"
  }
}
```

**Validation Rules:**

- `name`: string, required
- `year`: number, required

---

### 2. Get Album by ID

Mendapatkan detail album berdasarkan ID, termasuk daftar lagu dalam album.

**Endpoint:** `GET /albums/{id}`

**Response (200 - OK):**

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

**Response (404 - Not Found):**

```json
{
  "status": "fail",
  "message": "Album tidak ditemukan"
}
```

---

### 3. Update Album

Mengubah data album berdasarkan ID.

**Endpoint:** `PUT /albums/{id}`

**Request Body:**

```json
{
  "name": "Viva la Vida (Deluxe Edition)",
  "year": 2008
}
```

**Response (200 - OK):**

```json
{
  "status": "success",
  "message": "Album berhasil diperbarui"
}
```

**Validation Rules:**

- `name`: string, required
- `year`: number, required

---

### 4. Delete Album

Menghapus album berdasarkan ID.

**Endpoint:** `DELETE /albums/{id}`

**Response (200 - OK):**

```json
{
  "status": "success",
  "message": "Album berhasil dihapus"
}
```

**Response (404 - Not Found):**

```json
{
  "status": "fail",
  "message": "Album gagal dihapus. Id tidak ditemukan"
}
```

---

## Songs Endpoints

### 1. Create Song

Menambahkan lagu baru.

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

**Response (201 - Created):**

```json
{
  "status": "success",
  "message": "Lagu berhasil ditambahkan",
  "data": {
    "songId": "song-Qbax5Oy7L8WKf74l"
  }
}
```

**Validation Rules:**

- `title`: string, required
- `year`: number, required
- `genre`: string, required
- `performer`: string, required
- `duration`: number, optional
- `albumId`: string, optional

---

### 2. Get All Songs

Mendapatkan semua lagu dengan opsi pencarian.

**Endpoint:** `GET /songs`

**Query Parameters:**

- `title` (optional): Mencari lagu berdasarkan judul
- `performer` (optional): Mencari lagu berdasarkan performer

**Examples:**

```
GET /songs
GET /songs?title=life
GET /songs?performer=coldplay
GET /songs?title=life&performer=coldplay
```

**Response (200 - OK):**

```json
{
  "status": "success",
  "data": {
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
```

---

### 3. Get Song by ID

Mendapatkan detail lagu berdasarkan ID.

**Endpoint:** `GET /songs/{id}`

**Response (200 - OK):**

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

**Response (404 - Not Found):**

```json
{
  "status": "fail",
  "message": "Lagu tidak ditemukan"
}
```

---

### 4. Update Song

Mengubah data lagu berdasarkan ID.

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

**Response (200 - OK):**

```json
{
  "status": "success",
  "message": "Lagu berhasil diperbarui"
}
```

**Validation Rules:**

- `title`: string, required
- `year`: number, required
- `genre`: string, required
- `performer`: string, required
- `duration`: number, optional
- `albumId`: string, optional

---

### 5. Delete Song

Menghapus lagu berdasarkan ID.

**Endpoint:** `DELETE /songs/{id}`

**Response (200 - OK):**

```json
{
  "status": "success",
  "message": "Lagu berhasil dihapus"
}
```

**Response (404 - Not Found):**

```json
{
  "status": "fail",
  "message": "Lagu gagal dihapus. Id tidak ditemukan"
}
```

---

## ⚠️ Error Handling

API menggunakan HTTP status code standar:

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | OK - Request berhasil                |
| 201         | Created - Resource berhasil dibuat   |
| 400         | Bad Request - Validation error       |
| 404         | Not Found - Resource tidak ditemukan |
| 500         | Internal Server Error - Server error |

### Error Response Examples

**400 - Bad Request (Validation Error):**

```json
{
  "status": "fail",
  "message": "\"name\" is required"
}
```

**404 - Not Found:**

```json
{
  "status": "fail",
  "message": "Album tidak ditemukan"
}
```

**500 - Internal Server Error:**

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
│   └── 1769582000002_create-table-songs.js
├── src/
│   ├── exceptions/
│   │   ├── client-error.js
│   │   ├── invariant-error.js
│   │   ├── not-found-error.js
│   │   └── index.js
│   ├── middlewares/
│   │   ├── error.js
│   │   └── validate.js
│   ├── routes/
│   │   └── index.js
│   ├── server/
│   │   └── index.js
│   ├── services/
│   │   ├── albums/
│   │   │   ├── controller/
│   │   │   │   └── album-controller.js
│   │   │   ├── repositories/
│   │   │   │   └── album-repositories.js
│   │   │   ├── routes/
│   │   │   │   └── index.js
│   │   │   └── validator/
│   │   │       └── schema.js
│   │   └── songs/
│   │       ├── controller/
│   │       │   └── song-controller.js
│   │       ├── repositories/
│   │       │   └── song-repositories.js
│   │       ├── routes/
│   │       │   └── index.js
│   │       └── validator/
│   │           └── schema.js
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
- **src/middlewares/**: Express middlewares (error handler, validation)
- **src/routes/**: Route definitions
- **src/server/**: Express app configuration
- **src/services/**: Business logic (controller, repository, routes, validator)
- **src/utils/**: Utility functions

---
