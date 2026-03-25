import type { Request, Response } from "express";
import { astroService } from "./astro.service";
import { handleControllerError } from "../utils/error/errorHandler";

class AstroController {
  calculateChart(req: Request, res: Response) {
    try {
      const {
        year,
        month,
        day,
        hour,
        minute,
        latitude,
        longitude,
        houseSystem,
        zodiac,
        aspectTypes,
        aspectPoints,
        aspectWithPoints,
        customOrbs,
        language,
      } = req.body;

      const chart = astroService.calculateChart({
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
        latitude: Number(latitude),
        longitude: Number(longitude),
        houseSystem,
        zodiac,
        aspectTypes,
        aspectPoints,
        aspectWithPoints,
        customOrbs,
        language,
      });

      res.status(200).json(chart);
    } catch (error) {
      return handleControllerError(res, error);
    }
  }
}

export const astroController = new AstroController();