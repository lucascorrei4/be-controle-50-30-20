import { EntityRepository, Repository } from 'typeorm';

import Mail from '@models/Mail';

@EntityRepository(Mail)
class MailRepository extends Repository<Mail> {
  public async findByIsAberto(): Promise<Mail[] | null> {
    const findMails: Mail[] = await this.createQueryBuilder()
      .select('*')
      .where('is_aberto = false', { is_aberto: false })
      .andWhere(
        "email NOT IN ('lucas.correia@ebarn.com.br','mona.nobrega@ebarn.com.br','ronan.oliveira@ebarn.com.br','thais.albuquerque@ebarn.com.br')"
      )
      .andWhere("data_envio::date >= date(now() - INTERVAL '48 HOURS')")
      .andWhere("data_envio::date <= date(now() - INTERVAL '24 HOURS')")
      .orderBy('id', 'DESC')
      .execute();

    return findMails || null;
  }
}

export default MailRepository;
