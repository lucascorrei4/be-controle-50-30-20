/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usuario')
class Usuario {
  @PrimaryColumn({ unique: true, type: 'integer' })
  id: number;

  @Column('boolean')
  aprovado: boolean;

  @Column('varchar')
  avatar: string;

  @Column('varchar')
  cpf: string;

  @Column('timestamp')
  data_alterada: Date;

  @Column('timestamp')
  data_cadastro: Date;

  @Column('timestamp')
  data_nascimento: Date;

  @Column('boolean')
  is_ebarn: boolean;

  @Column('varchar')
  email: string;

  @Column('int4')
  etapa: number;

  @Column('varchar')
  hash: string;

  @Column('boolean')
  is_deletado: boolean;

  @Column('varchar')
  nome: string;

  @Column('varchar')
  perfil: string;

  @Column('boolean')
  rejeitado: boolean;

  @Column('varchar')
  senha: string;

  @Column('varchar')
  telefone: string;

  @Column('varchar')
  telefone2: string;

  @Column('int4')
  token: number;

  @Column('varchar')
  token_fb: string;

  @Column('varchar')
  verification_mail: string;

  @Column('varchar')
  token_aplicacao: string;

  @Column('varchar')
  url_invite: string;
}

export default Usuario;
