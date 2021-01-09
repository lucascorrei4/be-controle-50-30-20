/* eslint-disable prettier/prettier */
const PADRAO_DESC_MATERIAL_SOJA = 19630;
const PADRAO_DESC_MATERIAL_MILHO = 19633;
const PADRAO_DESC_MATERIAL_FEIJAO = 19632;

const TAG_TIPO_GRAO = 'tipo_grao';
const TAG_TIPO_FEIJAO = 'tipo_feijao';
const TAG_DATA_DISPONIBILIDADE = 'data_disponibilidade';

export const getNomeGrao = (padraoDescMaterial: number): string => {
  const graos = {
    [PADRAO_DESC_MATERIAL_FEIJAO]: 'Feijão',
    [PADRAO_DESC_MATERIAL_MILHO]: 'Milho',
    [PADRAO_DESC_MATERIAL_SOJA]: 'Soja'
  };

  return graos[padraoDescMaterial] ?? '';
};

export const getAtributoProposta = <T>(proposta: any, tag: string): T => {
  const attr = proposta.loteGraoObj.atributos.find(atr => atr.tag === tag);
  return attr?.valor ?? '';
};

export const getDataDisponibilidade = (proposta: any): Date =>
  getAtributoProposta<Date>(proposta, TAG_DATA_DISPONIBILIDADE);

export const getDescricaoGrao = (padraoDescMaterial: number, proposta: any): string =>
  (padraoDescMaterial === PADRAO_DESC_MATERIAL_FEIJAO
    ? `${getAtributoProposta(proposta, TAG_TIPO_GRAO)} - ${getAtributoProposta(proposta, TAG_TIPO_FEIJAO)}`
    : getAtributoProposta(proposta, TAG_TIPO_GRAO));
