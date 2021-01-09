import { Request, Response } from 'express';

import Page from '@schemas/Page';

class DestaqueController {
  public async index(req: Request, res: Response): Promise<Response> {
    const pages = await Page.find(
      { isDestaque: true, habilitado: true },
      'slug icone titulo createdAt descricaoSeo',
      { limit: 10 }
    ).sort({ createdAt: -1 });

    return res.json(pages);
  }
}

export default new DestaqueController();
