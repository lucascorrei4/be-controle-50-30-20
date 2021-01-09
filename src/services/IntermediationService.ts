import { Request } from 'express';

import ParamBodyRequiredException from '@exceptions/ParamBodyRequired.exception';

class IntermediationService {
  public validateFieldsStore(req: Request) {
    const requiredFieldsIntermediation = ['idLote', 'idProposta', 'tax', 'amount'];
    requiredFieldsIntermediation.forEach(field => {
      if (!req.body[field]) {
        throw new ParamBodyRequiredException(field);
      }
    });
  }
}

export default new IntermediationService();
