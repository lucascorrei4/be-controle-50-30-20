import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload-articles';
import uploadBanners from '@config/upload-banners';
import uploadFeijao from '@config/upload-feijao';
import AttachedDocController from '@controllers/AttachedDocController';
import AuthController from '@controllers/AuthController';
import BancosController from '@controllers/BancosController';
import BannerController from '@controllers/BannerController';
import ContractController from '@controllers/ContractController';
import DestaqueController from '@controllers/DestaqueController';
import GettingStartedController from '@controllers/GettingStartedController';
import InfoLoteController from '@controllers/InfoLoteController';
import NotificationController from '@controllers/NotificationController';
import PageController from '@controllers/PageController';
import PushSubscriptionController from '@controllers/PushSubscriptionController';
import SequenciaEmailController from '@controllers/SequenciaEmailController';
import SignatureController from '@controllers/SignatureController';
import UserController from '@controllers/UserController';
import VersionAppController from '@controllers/VersionAppController';
import TokenJava from '@middlewares/TokenJava';
import UploadMulter from '@middlewares/UploadMulter';
import catmatRoutes from '@routes/catmat.routes';
import chargeRoutes from '@routes/charges.routes';
import closedLotsRoutes from '@routes/closedLots.routes';
import emailRoutes from '@routes/email.routes';
import intermediationRoutes from '@routes/intermediation.routes';
import invoiceRoutes from '@routes/invoice.routes';
import paymentsRoutes from '@routes/payment.routes';
import planRoutes from '@routes/plan.routes';
import planSubscriptionsRoutes from '@routes/planSubscription.routes';
import receiptsRoutes from '@routes/receipts.routes';
import AuthService from '@services/AuthService';
import LaunchController from '@controllers/LaunchController';
import CategoryController from '@controllers/CategoryController';

const upload = multer(uploadConfig);
const uploadBanner = multer(uploadBanners);
const uploadImagesFeijao = multer(uploadFeijao);

const routes = Router();

routes.post('/auth', AuthController.auth);

// User Controller
routes.post('/user', UserController.create);
routes.get('/user/findByEmail', UserController.findByEmail);
routes.get('/user/all', UserController.findAll);
// routes.delete('/user', UserController.remove);

// Launch Controller
routes.post('/launch', LaunchController.create);
routes.get('/launch/findByUserIdAndMonthAndType', LaunchController.findByUserIdAndMonthAndType);
// routes.delete('/launch', LaunchController.remove);

// Category Controller
routes.post('/category', CategoryController.store);
routes.get('/category', CategoryController.index);
routes.delete('/category', CategoryController.removeAll);

routes.get('/destaques', DestaqueController.index);
routes.get('/pages', AuthService.authorize, PageController.index);
routes.post('/pages', AuthService.authorize, PageController.store);
routes.post('/image', upload.array('image'), (req, res) => res.status(204).send());

// Image Signature Controller
routes.post('/image-signatures', TokenJava.authorize, SignatureController.store);
routes.get('/image-signatures', TokenJava.authorize, SignatureController.show);
routes.delete('/remove-signatures', TokenJava.authorize, SignatureController.remove);

// Image Banner Controller
routes.post(
  '/image-banners',
  TokenJava.authorize,
  uploadBanner.single('image'),
  BannerController.store
);
routes.get('/list-image-banners', BannerController.findAll);
routes.post('/remove-banner', TokenJava.authorize, BannerController.remove);

// Pages CMS Controller
routes.get('/pages/:slug', PageController.show);
routes.put('/pages/:slug', AuthService.authorize, PageController.update);

// Push Notification Controller
routes.get('/push-subscriptions/quantity', PushSubscriptionController.quantity);
routes.get('/push-subscriptions/:idUsuario', PushSubscriptionController.exists);
routes.get('/push-subscriptions', PushSubscriptionController.index);
routes.post('/push-subscriptions', PushSubscriptionController.store);

routes.get('/notifications', TokenJava.authorize, NotificationController.index);
routes.post(
  '/notifications',
  TokenJava.authorize,
  UploadMulter.uploadImageNotification(),
  NotificationController.store
);
routes.post('/notifications/received', NotificationController.markAsPushReceived);
routes.post('/notifications/read', NotificationController.markAsPushRead);

// Contrato Graos Routes
routes.get('/contracts', TokenJava.authorize, ContractController.show);
routes.post(
  '/contracts',
  TokenJava.authorize,
  UploadMulter.uploadCertificate(),
  ContractController.signPdf
);
routes.get('/contracts/template', TokenJava.authorize, ContractController.showTemplate);

// Upload Comprovante Pag e NFe Contrato Graos Routes
routes.post(
  '/attached-docs/nfe',
  TokenJava.authorize,
  UploadMulter.uploadNFe(),
  AttachedDocController.uploadNfe
);
routes.post(
  '/attached-docs/comp-pag',
  TokenJava.authorize,
  UploadMulter.uploadComp(),
  AttachedDocController.uploadCompPag
);
routes.get('/attached-docs', TokenJava.authorize, AttachedDocController.findDocs);

// Getting Started
routes.get('/getting-started', TokenJava.authorize, GettingStartedController.show);
routes.post('/getting-started', TokenJava.authorize, GettingStartedController.store);

// Bancos
routes.post('/bancos', TokenJava.authorize, BancosController.store);
routes.get('/bancos', TokenJava.authorize, BancosController.index);
routes.delete('/bancos', TokenJava.authorize, BancosController.removeAll);

// Info Lote
routes.post('/info-lote', TokenJava.authorize, InfoLoteController.create);
routes.get('/info-lote', TokenJava.authorize, InfoLoteController.find);
routes.delete('/info-lote', TokenJava.authorize, InfoLoteController.remove);

// User
routes.post('/user', UserController.create);
routes.get('/user/findByEmail', UserController.findByEmail);
routes.get('/user/all', UserController.findAll);
// routes.delete('/user', UserController.remove);

// Feijão
routes.post('/feijao-images', uploadImagesFeijao.array('images'), (req, res) =>
  res.status(204).send()
);

// Catmat Controller
routes.use('/catmat', AuthService.authorize, catmatRoutes);

/*
Para ativar /sequencia-emails/active
?codigoAtivacao=999&email=email@teste.com&nome=eBarn Sobrenome&telefone=999999999999
*/
routes.get('/sequencia-emails/active', SequenciaEmailController.active);

routes.use('/sequencia-emails', AuthService.authorize, emailRoutes);

routes.use('/plans', planRoutes);

routes.use('/plan-subscriptions', planSubscriptionsRoutes);

routes.use('/receipts', receiptsRoutes);

routes.use('/invoices', invoiceRoutes);

routes.use('/intermediations', intermediationRoutes);

routes.use('/closed-lots', closedLotsRoutes);

routes.get('/version-app', VersionAppController.show);
routes.get('/version-app-update', VersionAppController.update);

routes.use('/charges', chargeRoutes);
routes.use('/payments', paymentsRoutes);

routes.post('/test-ebanx', (req, res) => {
  console.log(req.body);
  console.log(req.params);

  return res.send({ ok: true });
});

export default routes;
