import { RequestHandler } from 'express';
import { mkdirSync, mkdtempSync } from 'fs';
import multer from 'multer';

class UploadMulter {
  public uploadImageNotification(): RequestHandler {
    const storage = this.createStorage('./uploads/img/push');
    return multer({ storage }).single('image');
  }

  public uploadNFe(): RequestHandler {
    const storage = this.updateStorage('./uploads/docs/nfe');
    return multer({ storage }).single('nfe');
  }

  public uploadComp(): RequestHandler {
    const storage = this.updateStorage('./uploads/docs/comp-pag');
    return multer({ storage }).single('comp');
  }

  public uploadCertificate(): RequestHandler {
    const storage = this.createStorageTemp('tmp-');
    return multer({ storage }).single('cert');
  }

  private createStorage(pathStorage: string): multer.StorageEngine {
    return multer.diskStorage({
      destination: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error, destination: string) => void
      ) => {
        mkdirSync(pathStorage, { recursive: true });
        callback(null, pathStorage);
      },
      filename: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error, destination: string) => void
      ) => {
        const ext = file.originalname.split('.').pop();
        callback(null, `${new Date().valueOf()}.${ext}`);
      }
    });
  }

  private updateStorage(pathStorage: string) {
    return multer.diskStorage({
      destination: (req, file, callback) => {
        mkdirSync(pathStorage, { recursive: true });
        callback(null, pathStorage);
      },
      filename(request, file, callback) {
        const ext = file.originalname.split('.').pop();
        return callback(null, `${new Date().valueOf()}.${ext}`);
      }
    });
  }

  private createStorageTemp(prefixPath: string): multer.StorageEngine {
    return multer.diskStorage({
      destination: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error, destination: string) => void
      ) => {
        const path = mkdtempSync(prefixPath);
        callback(null, path);
      },
      filename: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error, destination: string) => void
      ) => {
        const ext = file.originalname.split('.').pop();
        callback(null, `${new Date().valueOf()}.${ext}`);
      }
    });
  }
}

export default new UploadMulter();
