import { Request } from 'express';

import InfoLote, { InfoLoteInterface } from '@schemas/InfoLote';

class InfoLoteService {
  public validateFields(req: Request) {
    const { idEmpresa, padraoDescMaterial } = req.query;

    if (!idEmpresa) {
      throw new Error('"idEmpresa" is required');
    }

    if (!padraoDescMaterial) {
      throw new Error('"padraoDescMaterial" is required');
    }
  }

  public async find(idEmpresa: number, padraoDescMaterial: number): Promise<InfoLoteInterface> {
    const infoLote = await InfoLote.findOne({
      idEmpresa,
      padraoDescMaterial
    });
    return infoLote;
  }
}

export default new InfoLoteService();
