import { mkdirSync } from 'fs';
import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const path = './uploads/icons';
      mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename(request, file, callback) {
      return callback(
        null,
        `${request.query.name}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`
      );
    }
  })
};
