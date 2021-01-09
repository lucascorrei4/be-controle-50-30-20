import { Router } from 'express';

import PlanController from '@controllers/PlanController';
import TokenJava from '@middlewares/TokenJava';

const planRoutes = Router();

planRoutes.get('/', PlanController.index);
planRoutes.get('/:id', PlanController.show);

planRoutes.use(TokenJava.authorize);
planRoutes.post('/', PlanController.store);
planRoutes.patch('/:id', PlanController.update);
planRoutes.delete('/:id', PlanController.destroy);

export default planRoutes;
