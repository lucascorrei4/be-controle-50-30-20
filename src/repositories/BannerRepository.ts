import { EntityRepository, Repository } from 'typeorm';

import Banner from '@models/Banner';

@EntityRepository(Banner)
class BannerRepository extends Repository<Banner> {}

export default BannerRepository;
