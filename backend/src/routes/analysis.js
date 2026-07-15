import { Router } from 'express';
import { criarAnalise, getAnalise } from '../controllers/analysisController.js';

const router = Router();

router.post('/', criarAnalise);
router.get('/:photoId', getAnalise);

export default router;
