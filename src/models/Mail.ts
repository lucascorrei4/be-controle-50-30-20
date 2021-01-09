/* eslint-disable camelcase */
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('mail')
class Mail {
  @PrimaryColumn({ unique: true, type: 'integer' })
  id: number;

  @Column('varchar')
  assunto: string;

  @Column('timestamp')
  data_envio: Date;

  @Column('varchar')
  email: string;

  @Column('text')
  obj1: string;

  @Column('boolean')
  is_aberto: boolean;
}

export default Mail;
