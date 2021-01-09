import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('banner')
class Banner {
  @PrimaryColumn({ unique: true, type: 'integer' })
  id: number;

  @Column('varchar')
  ref: string;

  @Column('varchar')
  name: string;
}

export default Banner;
