import { Request } from 'express';

import AttachedDoc, { AttachedDocInterface } from '@schemas/AttachedDoc';

class AttachedDocService {
  public validateFields(req: Request) {
    const { idLote, idProposta } = req.query;

    if (!idLote) {
      throw new Error('"idLote" is required');
    }

    if (!idProposta) {
      throw new Error('"idProposta" is required');
    }
  }

  public async validateFieldsNfe(req: Request) {
    const { idLote, idProposta } = req.body;

    if (!idLote) {
      throw new Error('"idLote" is required');
    }

    if (!idProposta) {
      throw new Error('"idProposta" is required');
    }

    if (!req.file || req.file.size === 0) {
      throw new Error('"nfe" is required');
    }
  }

  public async validateFieldsCompPag(req: Request) {
    const { idLote, idProposta } = req.body;

    if (!idLote) {
      throw new Error('"idLote" is required');
    }

    if (!idProposta) {
      throw new Error('"idProposta" is required');
    }

    if (!req.file || req.file.size === 0) {
      throw new Error('"compPag" is required');
    }
  }

  public async saveNFe(
    idLote: number,
    idProposta: number,
    nfe: string
  ): Promise<AttachedDocInterface> {
    let attachedDoc = await AttachedDoc.findOne({ idLote, idProposta });
    if (!attachedDoc) {
      attachedDoc = await AttachedDoc.create({ idLote, idProposta, nfe });
    }
    attachedDoc.nfeAttached = true;
    attachedDoc.nfe = nfe;
    return AttachedDoc.updateOne({ idLote, idProposta }, attachedDoc);
  }

  public async saveCompPag(
    idLote: number,
    idProposta: number,
    compPag: string
  ): Promise<AttachedDocInterface> {
    let attachedDoc = await AttachedDoc.findOne({ idLote, idProposta });
    if (!attachedDoc) {
      attachedDoc = await AttachedDoc.create({ idLote, idProposta, compPag });
    }
    attachedDoc.compPagAttached = true;
    attachedDoc.compPag = compPag;
    return AttachedDoc.updateOne({ idLote, idProposta }, attachedDoc);
  }

  public async findDocs(idLote: number, idProposta: number): Promise<AttachedDocInterface> {
    const attachedDoc = await AttachedDoc.findOne({
      idLote,
      idProposta
    });
    return attachedDoc;
  }
}

export default new AttachedDocService();
