// backend\src\login\routes\auth.routes.sql.ts
import { Router } from 'express'
import { authControllerSqlite } from '../controllers/auth.controller.sql'
import { limiter } from '../../utils/limiter'

const router = Router()

router.post('/', limiter(15, 5), authControllerSqlite.login)
router.post('/register', limiter(15, 5), authControllerSqlite.register)
router.post('/refresh', limiter(15, 5), authControllerSqlite.refreshToken)

export default router