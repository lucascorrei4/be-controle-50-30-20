import nconf from 'nconf';
import { createConnection } from 'typeorm';

import Catmat from '@models/Catmat';
import Empresa from '@models/Empresa';
import EmpresaUsuarios from '@models/EmpresaUsuarios';
import Mail from '@models/Mail';
import Usuario from '@models/Usuario';

export default function createConnectionPostgres(): void {
  const db = nconf.get('db');

  createConnection({
    type: 'postgres',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    entities: [Catmat, Mail, Usuario, EmpresaUsuarios, Empresa]
  });
}
