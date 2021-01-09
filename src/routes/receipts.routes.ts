import { Router } from 'express';

import ReceiptController from '@controllers/ReceiptController';
import TokenJava from '@middlewares/TokenJava';

const routes = Router();

routes.use(TokenJava.authorize);
routes.get('/:companyId', ReceiptController.index);

export default routes;
