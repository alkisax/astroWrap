// backend\src\login\routes\user.routes.sql.ts

import { Router } from 'express'
import { userController } from '../controllers/user.controller.sql'
import { middleware } from '../middleware/verification.middleware.sql'
import { limiter } from '../../utils/limiter'

const router = Router()

/* =========================
   CREATE (ADMIN ONLY)
========================= */
router.post(
  '/',
  // middleware.verifyToken,
  // middleware.checkRole('ADMIN'),
  // limiter(15, 5),
  userController.create,
)

/* =========================
   READ (ADMIN)
========================= */
router.get(
  '/',
  // middleware.verifyToken,
  // middleware.checkRole('ADMIN'),
  userController.findAll,
)

router.get(
  '/:id',
  // middleware.verifyToken,
  // middleware.checkRole('ADMIN'),
  userController.findById,
)

/* =========================
   UPDATE BASIC
========================= */
router.put(
  '/:id',
  // middleware.verifyToken,
  userController.updateById,
)

/* =========================
   UPDATE ROLE (ADMIN)
========================= */
router.put(
  '/:id/role',
  middleware.verifyToken,
  middleware.checkRole('ADMIN'),
  userController.updateRole,
)

/* =========================
   DELETE (ADMIN)
========================= */
router.delete(
  '/:id',
  // middleware.verifyToken,
  // middleware.checkRole('ADMIN'),
  userController.remove,
)

export default router
