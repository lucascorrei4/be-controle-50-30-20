import { Router } from 'express';

import PlanSubscriptionController from '@controllers/PlanSubscriptionController';
import TokenJava from '@middlewares/TokenJava';

const routes = Router();

routes.post('/', PlanSubscriptionController.store);
routes.post('/request-recurrence', PlanSubscriptionController.requestRecurrence);
routes.post('/request-charge', PlanSubscriptionController.requestCharge);
routes.get('/:companyId/is-active', PlanSubscriptionController.isActive);
routes.get('/:companyId', PlanSubscriptionController.show);

routes.use(TokenJava.authorize);
routes.get('/verify-payment/:id', PlanSubscriptionController.verifyPayment);
routes.delete('/:companyId/request-plan', PlanSubscriptionController.destroyRequestPlan);

export default routes;
