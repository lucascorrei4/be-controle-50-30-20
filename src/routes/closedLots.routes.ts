import { Router } from 'express';

import ClosedLotsController from '@controllers/ClosedLotsController';
import AuthService from '@services/AuthService';

const routes = Router();

routes.use(AuthService.authorize);
routes.get('/', ClosedLotsController.index);

export default routes;
