import { getCustomRepository } from 'typeorm';

import Usuario from '@models/Usuario';
import UsuarioRepository from '@repositories/UsuarioRepository';
import EmailQueueSchema from '@schemas/EmailQueue';
import { Email, SequenciaEmailInterface } from '@schemas/SequenciaEmail';
import SMSQueueSchema from '@schemas/SMSQueue';

import emailsAdminsJson from '../data/emails-admin.json';

interface EmailAdmin {
  nome: string;
  email: string;
}

let sequenciaEmail: SequenciaEmailInterface;
let todosUsuarios: Usuario[];
const emailsAdmins: EmailAdmin[] = emailsAdminsJson;

class CreateEmailQueueService {
  public async execute(sequencia: SequenciaEmailInterface): Promise<void> {
    sequenciaEmail = sequencia;
    const usuarioRepository = getCustomRepository(UsuarioRepository);
    if (!sequencia.dataInicio || sequencia.dataInicio <= new Date()) {
      switch (sequencia.perfil) {
        case 'TODOS':
          if (sequencia.enviarPara === 'TODOS') {
            todosUsuarios = await usuarioRepository.findUsuarios();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'C/EMPRESA') {
            todosUsuarios = await usuarioRepository.findUsuariosComEmpresa();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'S/EMPRESA') {
            todosUsuarios = await usuarioRepository.findUsuariosSemEmpresa();
            await this.criarQueue();
          }
          break;
        case 'INDUSTRIA':
          if (sequencia.enviarPara === 'TODOS') {
            todosUsuarios = await usuarioRepository.findIndustrias();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'C/EMPRESA') {
            todosUsuarios = await usuarioRepository.findIndustriasComEmpresa();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'S/EMPRESA') {
            todosUsuarios = await usuarioRepository.findIndustriasSemEmpresa();
            await this.criarQueue();
          }
          break;
        case 'PRODUTOR':
          if (sequencia.enviarPara === 'TODOS') {
            todosUsuarios = await usuarioRepository.findProdutor();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'C/EMPRESA') {
            todosUsuarios = await usuarioRepository.findProdutorComEmpresa();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'S/EMPRESA') {
            todosUsuarios = await usuarioRepository.findProdutorSemEmpresa();
            await this.criarQueue();
          }
          break;
        case 'FORNECEDOR':
          if (sequencia.enviarPara === 'TODOS') {
            todosUsuarios = await usuarioRepository.findFornecedor();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'C/EMPRESA') {
            todosUsuarios = await usuarioRepository.findFornecedorComEmpresa();
            await this.criarQueue();
          } else if (sequencia.enviarPara === 'S/EMPRESA') {
            todosUsuarios = await usuarioRepository.findFornecedorSemEmpresa();
            await this.criarQueue();
          }
          break;
        default:
          break;
      }
    }
  }

  private async criarQueue() {
    let corpoEmailFinal: string;
    const dataDeEnvio = new Date();

    sequenciaEmail.emails.forEach(async (value: Email, index) => {
      switch (sequenciaEmail.periodoDeEnvio) {
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

      if (value.enviarParaAdmin) {
        emailsAdmins.forEach(async emailAdmin => {
          if (value.template.match('@@nome@@')) {
            corpoEmailFinal = value.template.replace('@@nome@@', emailAdmin.nome);
          } else {
            corpoEmailFinal = value.template;
          }
          await EmailQueueSchema.create({
            idUsuario: null,
            email: emailAdmin.email,
            corpo: corpoEmailFinal,
            assunto: `REPORT: ${value.assunto}`,
            data_envio: dataDeEnvio
          });
        });
      }

      todosUsuarios.forEach(async user => {
        const emailsDoUserNaFila = await EmailQueueSchema.find({
          enviado: false,
          email: user.email
        });

        if (!(sequenciaEmail.excluirQuemTemEmailAReceber && emailsDoUserNaFila.length > 0)) {
          if (value.template.match('@@nome@@')) {
            corpoEmailFinal = value.template.replace('@@nome@@', user.nome);
          } else {
            corpoEmailFinal = value.template;
          }

          await EmailQueueSchema.create({
            idUsuario: user.id,
            email: user.email,
            corpo: corpoEmailFinal,
            assunto: value.assunto,
            data_envio: dataDeEnvio
          });

          if (value.enviarSMS) {
            await SMSQueueSchema.create({
              numero: user.telefone,
              mensagem: value.assunto,
              data_envio: dataDeEnvio
            });
          }
        }
      });
    });
  }
}

export default CreateEmailQueueService;
