import { Router } from 'express';
import { handleWebhook } from '../controllers/webhookController.js';
const router = Router();
router.post('/whatsapp', handleWebhook);
export default router;
