/* eslint-disable camelcase */
import axios from 'axios';
import { CronJob } from 'cron';
import nconf from 'nconf';

import EmailQueue from '@schemas/EmailQueue';
import PushSubscription, { PushSubscriptionInterface } from '@schemas/PushSubscription';
import SequenciaEmail from '@schemas/SequenciaEmail';
import SMSQueue from '@schemas/SMSQueue';
import CreateEmailQueueService from '@services/CreateEmailQueueService';
import PushNotificationService from '@services/PushNotificationService';

const job = new CronJob(
  '0 */10 * * * *',
  async () => {
    console.log(`Iniciou sequencia email - ${new Date()}`);
    const createEmailQueue = new CreateEmailQueueService();

    const sequencias = await SequenciaEmail.find({ ativo: true });
    const filaEmails = await EmailQueue.find({ enviado: false });
    const filaSMS = await SMSQueue.find({ enviado: false });

    /*
      Se a sequencia tiver data de inicio e
      a data for menor igual a data e hora
      atual ela manda para a lista
    */
    sequencias.forEach(async sequencia => {
      if (sequencia.dataInicio && sequencia.dataInicio <= new Date() && sequencia.ativo) {
        await createEmailQueue.execute(sequencia).catch(err => {
          throw new Error(err);
        });
        await SequenciaEmail.findByIdAndUpdate(sequencia._id, { ativo: false });
      }
    });

    /*
    Enviando todos os emails da fila para a data e hora menor ou igual a atual
    */
    filaEmails.forEach(async email => {
      console.log(`Assunto: ${email.assunto} | Para : ${email.email}`);
      if (email.data_envio <= new Date()) {
        axios
          .post(`${nconf.get('urlService')}/mail/send-white`, {
            assunto: email.assunto,
            email: email.email,
            text: email.corpo
          })
          .then(async () => {
            await EmailQueue.findOneAndUpdate({ _id: email._id }, { enviado: true });
          })
          .catch(async erro => {
            console.error(erro);
          });

        // Envia as notificações
        if (email && email.idUsuario) {
          const pushNotificationUser = await PushSubscription.findOne({
            idUsuario: email.idUsuario
          });
          const arrayPush: PushSubscriptionInterface[] = [];
          arrayPush.push(pushNotificationUser);
          await PushNotificationService.send({
            title: email.assunto,
            body: null,
            image: null,
            data: null,
            subscriptions: arrayPush
          });
        }
      }
    });

    filaSMS.forEach(sms => {
      if (sms.data_envio <= new Date()) {
        axios
          .post(`${nconf.get('urlService')}/send/notification/sms`, {
            mensagem: sms.mensagem,
            telefone: sms.numero
          })
          .then(async () => {
            await SMSQueue.findOneAndUpdate({ _id: sms._id }, { enviado: true });
          })
          .catch(() => {
            console.error(`Sms não enviado para: ${sms.numero}`);
          });
      }
    });
  },
  () => console.log('Parou sequencia de email'),
  null,
  'America/Sao_Paulo'
);
export default job;
