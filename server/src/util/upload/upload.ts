import multer from 'multer';
import path from 'path';
import { CustomError } from '../error/CustomError';

const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return callback(null, true);
    } else {
        callback(new CustomError('Only CSV and Excel files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

export default upload;