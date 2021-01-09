import { Router } from 'express';

import IntermediationController from '@controllers/IntermediationController';
import AuthService from '@services/AuthService';

const routes = Router();

routes.get('/', IntermediationController.show);
routes.use(AuthService.authorize);
routes.post('/', IntermediationController.store);

export default routes;
