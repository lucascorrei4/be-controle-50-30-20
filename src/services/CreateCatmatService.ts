import { getCustomRepository } from 'typeorm';

import Catmat from '@models/Catmat';
import CatmatRepository from '@repositories/CatmatRepository';

class CreateCatmatService {
  public async execute(data: Catmat): Promise<Catmat> {
    const catmatRepository = getCustomRepository(CatmatRepository);

    const last: Catmat = await catmatRepository
      .createQueryBuilder('catmat')
      .select()
      .where('padrao_desc_material != 99999')
      .orderBy('padrao_desc_material', 'DESC')
      .getOne();

    const lastGrupo: Catmat = await catmatRepository
      .createQueryBuilder('catmat')
      .select()
      .where('grupo_material != 99999')
      .orderBy('grupo_material', 'DESC')
      .getOne();

    if (data.grupo_material === null) {
      data.grupo_material = parseInt(lastGrupo.grupo_material.toString()) + 1;
    }
    const lastId: number = parseInt(last.padrao_desc_material.toString()) + 1;
    data.padrao_desc_material = lastId;

    const catmatNew: Catmat = {
      data_cadastro: new Date(Date.now()).toISOString(),
      ...data
    };

    const catmat = catmatRepository.create(catmatNew);

    await catmatRepository.save(catmat);

    return catmat;
  }
}

export default CreateCatmatService;
