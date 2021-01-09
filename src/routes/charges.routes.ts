import { Router } from 'express';

import ChargeController from '@controllers/ChargeController';

const routes = Router();

routes.post('/', ChargeController.store);
routes.get('/:companyId', ChargeController.show);
routes.delete('/:companyId', ChargeController.destroy);

export default routes;
