import { Request, Response } from 'express';

import VersionAppSchema from '@schemas/VersionApp';

class VersionApp {
  public async show(req: Request, res: Response): Promise<Response> {
    let versionApp = await VersionAppSchema.findOne();
    if (!versionApp) {
      versionApp = await VersionAppSchema.create({ version: 1.0 });
    }

    return res.json(versionApp);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const versionApp = await VersionAppSchema.findOne();
    await VersionAppSchema.updateOne(versionApp, {
      version: Number((versionApp.version + 0.1).toFixed(1))
    });
    const versionAppNew = await VersionAppSchema.findOne();

    return res.json(versionAppNew);
  }
}

export default new VersionApp();
