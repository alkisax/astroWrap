import { Router } from "express";
import { astroController } from "./astro.controller";

const router = Router();

router.post("/calculate", astroController.calculateChart);

export default router;