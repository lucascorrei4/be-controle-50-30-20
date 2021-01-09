import { Router } from 'express';

import InvoiceController from '@controllers/InvoiceController';
import TokenJava from '@middlewares/TokenJava';

const routes = Router();

routes.use(TokenJava.authorize);
routes.get('/intermedicacao/:merchantPaymentCode', InvoiceController.showIntermediacao);
routes.get('/mensalidade/:merchantPaymentCode', InvoiceController.showMensalidade);

routes.get('/template/:merchantPaymentCode', InvoiceController.showTemplate);

export default routes;
