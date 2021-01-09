import { mkdirSync } from 'fs';
import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const path = './uploads/img/feijao';
      mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename(request, file, callback) {
      return callback(null, file.originalname);
    }
  })
};
