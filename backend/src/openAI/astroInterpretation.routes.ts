// backend\src\openAI\astroInterpretation.routes.ts
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { astroControllers } from './astroInterpretation.controller';
import { biwheelControllers } from './biwheelInterpretation.controller';

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});

router.post('/single-chart', limiter, astroControllers.astroInterpretationController);

router.post(
  '/biwheel',
  limiter,
  biwheelControllers.biwheelInterpretationController
);

export default router;