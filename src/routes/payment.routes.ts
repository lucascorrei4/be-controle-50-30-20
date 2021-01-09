import { Router } from 'express';

import PaymentController from '@controllers/PaymentController';
import TokenJava from '@middlewares/TokenJava';

const routes = Router();

routes.use(TokenJava.authorize);
routes.post('/finalize', PaymentController.finalize);

export default routes;
