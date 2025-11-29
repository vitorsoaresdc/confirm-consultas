import { Router } from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = Router();

router.post('/whatsapp', handleWebhook);

export default router;

