/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('empresa')
class Empresa {
  @PrimaryColumn({ unique: true, type: 'integer' })
  id: number;

  @Column('varchar')
  bairro: string;

  @Column('varchar')
  cep: string;

  @Column('int4')
  id_cidade: number;

  @Column('varchar')
  cnpj: string;

  @Column('varchar')
  complemento: string;

  @Column('timestamp')
  data_alterada: Date;

  @Column('timestamp')
  data_cadastro: Date;

  @Column('varchar')
  fantasia: string;

  @Column('varchar')
  ie: string;

  @Column('boolean')
  is_deletado: boolean;

  @Column('varchar')
  logradouro: string;

  @Column('varchar')
  numero: string;

  @Column('int4')
  id_pais: number;

  @Column('varchar')
  perfil: string;

  @Column('varchar')
  razao: string;

  @Column('varchar')
  tipo: string;

  @Column('int4')
  id_uf: number;

  @Column('varchar')
  roteiro_entrega: string;

  @Column('int4')
  qtd_propostas_ganhas: number;

  @Column('varchar')
  cupom: string;

  @Column('varchar')
  sobre: string;
}

export default Empresa;
