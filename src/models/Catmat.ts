/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('catmat')
class Catmat {
  @PrimaryColumn({ unique: true })
  padrao_desc_material: number;

  @Column('bigint')
  classe_material: bigint;

  @Column('text')
  detalhe: string;

  @Column()
  grupo: string;

  @Column('bigint')
  grupo_material: number;

  @Column('boolean')
  is_deletado: boolean;

  @Column()
  item: string;

  @Column()
  sub_grupo: string;

  @Column()
  descricao: string;

  @Column('integer')
  id_item: number;

  @Column('integer')
  id: number;

  @Column()
  icon: string;

  @Column('timestamp')
  data_cadastro: Date;

  @Column('integer')
  position: number;

  @Column()
  tags: string;
}

export default Catmat;
