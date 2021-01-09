import { EntityRepository, Repository } from 'typeorm';

import Catmat from '@models/Catmat';

@EntityRepository(Catmat)
class CatmatRepository extends Repository<Catmat> {}

export default CatmatRepository;
