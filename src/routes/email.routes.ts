import { Router } from 'express';

import SequenciaEmailController from '@controllers/SequenciaEmailController';

const emailRoutes = Router();

emailRoutes.get('/lista', SequenciaEmailController.index);
emailRoutes.post('/', SequenciaEmailController.store);
emailRoutes.get('/', SequenciaEmailController.show);

export default emailRoutes;
