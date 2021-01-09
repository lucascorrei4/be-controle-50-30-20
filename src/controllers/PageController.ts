import { Request, Response } from 'express';

import Page, { PageInterface } from '@schemas/Page';

class PageController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { slug } = req.params;

    const page = await Page.findOne({ slug });

    return res.json(page);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { page = 1 } = req.query;
    const itemsPerPage = 12;

    const total = await Page.countDocuments();
    const pages = await Page.find({}, 'slug titulo createdAt habilitado', {
      skip: (Number(page) - 1) * itemsPerPage,
      limit: itemsPerPage
    }).sort({ createdAt: -1 });

    res.header('X-Total-Count', String(total));
    return res.json({
      pages,
      totalPages: total
    });
  }

  public async store(req: Request, res: Response): Promise<Response> {
    const { titulo } = req.body;

    const slug = titulo
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a')
      .replace(/[èÈéÉêÊëË]+/g, 'e')
      .replace(/[ìÌíÍîÎïÏ]+/g, 'i')
      .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o')
      .replace(/[ùÙúÚûÛüÜ]+/g, 'u')
      .replace(/[ýÝÿŸ]+/g, 'y')
      .replace(/[ñÑ]+/g, 'n')
      .replace(/[çÇ]+/g, 'c')
      .replace(/[ß]+/g, 'ss')
      .replace(/[Ææ]+/g, 'ae')
      .replace(/[Øøœ]+/g, 'oe')
      .replace(/[%]+/g, 'pct')
      .replace(/\s+/g, '-')
      .replace(/[^\w\\-]+/g, '')
      .replace(/\\-\\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    let page: PageInterface;
    try {
      page = await Page.create({ ...req.body, slug });
    } catch (e) {
      return res.status(400).send(e);
    }

    return res.json(page);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { slug } = req.params;
    const updatedPage = { ...req.body, _id: undefined, slug: undefined };

    const page = await Page.findOneAndUpdate({ slug }, updatedPage, {
      new: true,
      omitUndefined: true,
      projection: {
        _id: false,
        __v: false,
        updatedAt: false
      }
    });

    if (!page) {
      return res.status(400).send({ error: `'${slug}' não encontrado!` });
    }

    return res.json(page);
  }
}

export default new PageController();
