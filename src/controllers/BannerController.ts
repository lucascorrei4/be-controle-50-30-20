import { Request, Response } from 'express';

import Banner from '@schemas/Banner';

class BannerController {
  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const ref = req?.query?.ref ?? undefined;
      const name = req?.query?.name ?? undefined;
      const habilitar = req?.query?.habilitar ?? false;
      const { _id: id } = await Banner.create({ ref, name, habilitar });
      return res.status(200).send();
    } catch (err) {
      console.warn(err);
      return res.status(400).send({ error: err.message });
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    const banners = await Banner.find().sort({ createdAt: -1 });

    return res.json(banners);
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    try {
      await Banner.findOneAndDelete({ _id: req.body._id });
      return res.status(200).send();
    } catch (err) {
      console.warn(err);
      return res.status(400).send({ error: err.message });
    }
  }
}
export default new BannerController();
