import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StorageService {
    constructor() {
        this.uploadsDir = path.resolve(__dirname, '../../../public/uploads/covers');

        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    writeFile(file, filename) {
        const filePath = path.join(this.uploadsDir, filename);

        return new Promise((resolve, reject) => {
            const fileStream = fs.createReadStream(filePath);

            fileStream.on('error', (error) => reject(error));

            file.on('end', () => resolve(filename))

            file.pipe(fileStream);
        })
    }

    deleteFile(filename) {
        const filePath = path.join(this.uploadsDir, filename);

        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (error) => {
                if (error && error.code !== 'ENOENT') {
                    return reject(error)
                }
                resolve()
            })
        })
    }

    getFileUrl(filename) {
        return `http://${process.env.HOST}:${process.env.PORT}/uploads/covers/${filename}`
    }
}

export default new StorageService();