import express from 'express';
import {
  initializePayment,
  mpesaCallback,
  checkPaymentStatus,
  getPaymentMethods,
  getPaymentConfig,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import mpesaAuth from '../middleware/mpesaAuth.js';

const router = express.Router();

// Payment methods and config
router.route('/methods').get(getPaymentMethods);

router.route('/config').get(getPaymentConfig);

// M-Pesa webhook
router.route('/mpesa/callback').post(mpesaAuth, mpesaCallback);

// Payment processing
router.route('/initialize').post(authenticate, initializePayment);

router.route('/status/:orderId').get(authenticate, checkPaymentStatus);

export default router;
