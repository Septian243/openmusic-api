import multer from "multer";
import path from 'path';
import InvariantError from '../exceptions/invariant-error.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new InvariantError('Invalid file type. Only JPG, JPEG, PNG, GIF, and WebP files are allowed.'));
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 512000,
    },
    fileFilter,
})

export default upload;