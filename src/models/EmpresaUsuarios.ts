/* eslint-disable camelcase */
import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

import Empresa from '@models/Empresa';
import Usuario from '@models/Usuario';

@Entity('empresa_usuarios')
class EmpresaUsuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Empresa, empresa => empresa.id)
  @JoinColumn()
  empresas_id: number;

  @OneToOne(() => Usuario, usuario => usuario.id)
  @JoinColumn()
  usuarios_id: number;

  @Column('timestamp')
  data_alterada: Date;

  @Column('timestamp')
  data_cadastro: Date;

  @Column('int4')
  perfil: number;

  @Column('int4')
  status: number;
}

export default EmpresaUsuarios;
