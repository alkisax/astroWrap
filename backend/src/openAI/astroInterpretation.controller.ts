import { Request, Response } from 'express';
import { getAstroInterpretation } from './astroInterpretation.service';
import { ValidationError } from '../utils/error/errors.types';
import { handleControllerError } from '../utils/error/errorHandler';

const astroInterpretationController = async (req: Request, res: Response) => {
  try {
    const { chart } = req.body;

    // basic validation
    if (!chart || typeof chart !== 'object') {
      throw new ValidationError('Invalid chart data');
    }

    const result = await getAstroInterpretation(chart);

    return res.json({
      status: true,
      interpretation: result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const astroControllers = {
  astroInterpretationController,
};