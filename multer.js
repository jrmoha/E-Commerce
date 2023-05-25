import multer from "multer";
import path from 'path';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'public/images/users/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime() + path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage, limits: { fieldSize: 800000 } });

export default upload;