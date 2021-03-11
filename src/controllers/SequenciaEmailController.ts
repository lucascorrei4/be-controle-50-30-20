import dayjs from 'dayjs';
import { Request, Response } from 'express';

import EmailQueueSchema from '@schemas/EmailQueue';
import SequenciaEmail, { Email, SequenciaEmailInterface } from '@schemas/SequenciaEmail';
import SMSQueueSchema from '@schemas/SMSQueue';
import CreateEmailQueueService from '@services/CreateEmailQueueService';
import { formatDate } from '@utils/format';

import emailsAdminsJson from '../data/emails-admin.json';

class DestaqueController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { order } = req.query;
      let sequencias: SequenciaEmailInterface[];
      if (order === 'TODOS') {
        sequencias = await SequenciaEmail.find().sort({ ativo: -1 });
      } else if (order !== 'TODOS') {
        sequencias = await SequenciaEmail.find({ perfil: String(order) }).sort({ ativo: -1 });
      }
      return res.json(sequencias);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  public async store(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      const createEmailQueue = new CreateEmailQueueService();
      const sequenciaExiste: SequenciaEmailInterface = await SequenciaEmail.findOne({
        _id: body._id
      });

      if (sequenciaExiste) {
        const sequencia = await SequenciaEmail.updateOne({ _id: body._id }, body);
        return res.json(sequencia);
      }

      // Adicionando os emails da sequencia na fila
      const sequencia: SequenciaEmailInterface = await SequenciaEmail.create(body);
      await createEmailQueue.execute(sequencia).catch(err => {
        throw new Error(err);
      });
      return res.status(201).json(sequencia);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.query.idSequencia;
      const sequencia: SequenciaEmailInterface = await SequenciaEmail.findOne({ _id: id });
      if (sequencia) {
        return res.status(200).json(sequencia);
      }
      return res.status(400).json({ message: 'Não existe sequencia com esse ID!' });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  public async active(req: Request, res: Response): Promise<Response> {
    try {
     
      const emailsAdmins = emailsAdminsJson;
      const codigoAtivacao = String(req.query.codigo);
      let idUsuario;
      if (req.query.idUsuario !== 'null' && req.query.idUsuario !== null) {
        idUsuario = Number(req.query.idUsuario);
      }
      const telefone = String(req.query.telefone);
      const emailAEnviar: string[] = [];
      emailAEnviar.push(String(req.query.email));
      const nome = String(req.query.nome);
      const sequencia: SequenciaEmailInterface = await SequenciaEmail.findOne({ codigoAtivacao });
      let corpoEmailFinal: string;
      console.log('Fila de e-mails a enviar:82 ', emailAEnviar);
      sequencia.emails.forEach(async (value: Email, index) => {
        if (value.enviarParaAdmin) {
          emailsAdmins.forEach(e => {
            emailAEnviar.push(e.email);
          });
          console.log('Fila de e-mails a enviar:88 ', emailAEnviar);
        }
        if (value.template.match('@@nome@@')) {
          corpoEmailFinal = value.template.replace('@@nome@@', nome);
        } else {
          corpoEmailFinal = value.template;
        }
        const dataDeEnvio = new Date();
        switch (sequencia.periodoDeEnvio) {
          case 'A CADA DOIS DIAS':
            dataDeEnvio.setDate(dataDeEnvio.getDate() + index * 2);
            break;
          case 'A CADA TRES DIAS':
            dataDeEnvio.setDate(dataDeEnvio.getDate() + index * 3);
            break;
          default:
            dataDeEnvio.setDate(dataDeEnvio.getDate() + index);
            break;
        }
        emailAEnviar.forEach(async email => {
          await EmailQueueSchema.create({
            idUsuario,
            email,
            corpo: corpoEmailFinal,
            assunto:
              email !== String(req.query.email)
                ? `REPORT (${dayjs().format('HH:mm:ss')}): ${value.assunto}`
                : value.assunto,
            data_envio: dataDeEnvio
          });
        });

        if (value.enviarSMS) {
          await SMSQueueSchema.create({
            numero: telefone,
            mensagem: value.assunto,
            data_envio: dataDeEnvio
          });
        }
      });
      return res.json({
        status: 'ok'
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new DestaqueController();
