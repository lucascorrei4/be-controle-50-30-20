/* eslint-disable camelcase */
import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '@config/upload';
import Catmat from '@models/Catmat';
import CatmatRepository from '@repositories/CatmatRepository';
import CreateCatmatService from '@services/CreateCatmatService';

const catmatRoutes = Router();

const upload = multer(uploadConfig);

catmatRoutes.post('/', async (request, response) => {
  try {
    const { body } = request;
    if (body.padrao_desc_material !== null) {
      return response
        .status(400)
        .json({ message: 'Não é necessario passar o padrao_desc_material!' });
    }

    const createCatmat = new CreateCatmatService();

    const catmat: Catmat = await createCatmat.execute(body).catch(err => {
      throw new Error(err);
    });

    return response.status(201).json(catmat);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

catmatRoutes.get('/', async (request, response) => {
  const catmatRepository = getCustomRepository(CatmatRepository);
  const catmat: Catmat[] = await catmatRepository.find({ is_deletado: false });

  return response.json(catmat);
});

catmatRoutes.get('/grupos', async (request, response) => {
  const catmatRepository = getCustomRepository(CatmatRepository);
  const catmat: Catmat[] = await catmatRepository
    .createQueryBuilder()
    .select('grupo, grupo_material, icon')
    .where('is_deletado = false')
    .groupBy('grupo, grupo_material, icon')
    .having('COUNT(*) >= 1')
    .orderBy('grupo', 'ASC')
    .execute();

  return response.json(catmat);
});

catmatRoutes.get('/:padrao_desc_material', async (request, response) => {
  const padrao_desc_material = parseInt(request.params.padrao_desc_material);
  const catmatRepository = getCustomRepository(CatmatRepository);
  const catmat: Catmat = await catmatRepository.findOne({
    padrao_desc_material
  });
  return response.json(catmat);
});

catmatRoutes.put('/:padrao_desc_material', async (request, response) => {
  const { padrao_desc_material } = request.params;
  const { body } = request;

  const catmatRepository = getCustomRepository(CatmatRepository);
  const catmat = await catmatRepository
    .createQueryBuilder()
    .update(Catmat)
    .set(body)
    .where('padrao_desc_material = :padrao_desc_material', {
      padrao_desc_material
    })
    .execute();
  return response.json(catmat);
});

catmatRoutes.delete('/:padrao_desc_material', async (request, response) => {
  const { padrao_desc_material } = request.params;

  const catmatRepository = getCustomRepository(CatmatRepository);
  await catmatRepository
    .createQueryBuilder()
    .update(Catmat)
    .set({ is_deletado: true })
    .where('padrao_desc_material = :padrao_desc_material', {
      padrao_desc_material
    })
    .execute();
  return response.json({ message: 'Deletado com sucesso!' });
});

catmatRoutes.post('/icon', upload.single('icon'), async (request, response) =>
  response.json({ ok: true })
);

catmatRoutes.put('/grupo/:grupo_material', async (request, response) => {
  const { grupo_material } = request.params;
  const { grupo, icon } = request.body;

  const catmatRepository = getCustomRepository(CatmatRepository);
  const catmat = await catmatRepository
    .createQueryBuilder()
    .update(Catmat)
    .set({ grupo, icon })
    .where('grupo_material = :grupo_material', {
      grupo_material
    })
    .execute();
  return response.json(catmat);
});

export default catmatRoutes;
