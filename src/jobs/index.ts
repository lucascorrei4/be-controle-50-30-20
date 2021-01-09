/* eslint-disable camelcase */
import axios from 'axios';
import { CronJob } from 'cron';
import nconf from 'nconf';
import { getCustomRepository } from 'typeorm';

import MailRepository from '@repositories/MailRepository';
import Mail from '@schemas/Mail';

const job = new CronJob(
  '0 30 9 * * *',
  async () => {
    console.log('iniciou');

    const mailRepository = getCustomRepository(MailRepository);
    const mail = await mailRepository.findByIsAberto();

    const atual = await Mail.create({ emails: mail });

    const { emails } = atual;

    emails.forEach(async (obj, index) => {
      setTimeout(() => {
        axios
          .post(`${nconf.get('urlService')}/mail/re-send`, {
            assunto: obj.assunto.match('Você não viu isso?')
              ? obj.assunto
              : `Você não viu isso? ${obj.assunto}`,
            email: obj.email,
            id: obj.id,
            obj1: obj.obj1
          })
          .then(async () => {
            obj.enviado = true;
            await Mail.findOneAndUpdate({ _id: atual._id }, { emails });
          })
          .catch(async erro => {
            console.error(erro);
          });
      }, index * 7200);
    });
  },
  () => console.log('Stop'),
  null,
  'America/Sao_Paulo'
);

export default job;
