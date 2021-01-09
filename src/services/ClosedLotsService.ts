import axios from 'axios';
import nconf from 'nconf';

import EbarnException from '@exceptions/Ebarn.exception';
import Contract, { ContractInterface } from '@schemas/Contract';
import Intermediation from '@schemas/Intermediation';
import { getDescricaoGrao, getNomeGrao } from '@utils/graos';

class ClosedLotsSerice {
  public async getLotsWithoutIntermediation(): Promise<Array<any>> {
    const contracts = await this.getContractsWithoutIntermediations();

    const lots = await Promise.all(
      contracts.map(async contract => {
        const lote = await axios
          .get(`${nconf.get('urlService')}/graos/lote/${contract.idLote}`)
          .then(request => request.data)
          .catch(err => new EbarnException(err.response.data.message, err.response.data.status));

        const proposta = lote.propostasLoteGrao.find(p => p.id === contract.idProposta);

        return {
          idLote: contract.idLote,
          idProposta: proposta.id,
          dataContrato: lote.dataAlterada,
          grao: getNomeGrao(lote.padraoDescMaterial),
          tipoGrao: getDescricaoGrao(lote.padraoDescMaterial, proposta),
          qtd: proposta.qtd,
          total: proposta.qtd * proposta.valor,
          comprador: {
            id: lote.produtor.id,
            razao: lote.produtor.razao,
            fantasia: lote.produtor.fantasia
          },
          vendedor: {
            id: proposta.empresa.id,
            razao: proposta.empresa.razao,
            fantasia: proposta.empresa.fantasia
          }
        };
      })
    );

    return lots;
  }

  private async getContractsWithoutIntermediations(): Promise<Partial<ContractInterface>[]> {
    let contracts = await Contract.find({ hasContractGenerated: true })
      .select('idLote idProposta')
      .sort({ createdAt: -1 });

    contracts = await Promise.all(
      contracts.map(async contract => {
        const { idLote, idProposta } = contract;
        const intermediations = await Intermediation.find({ idLote, idProposta });
        return intermediations.length === 2 ? null : contract;
      })
    );

    return contracts.filter(contract => !!contract);
  }
}

export default new ClosedLotsSerice();
