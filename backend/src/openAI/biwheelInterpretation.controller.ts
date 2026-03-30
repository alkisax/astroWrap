import { Request, Response } from 'express';
import { getBiwheelInterpretation } from './biwheelInterpretation.service';
import { ValidationError } from '../utils/error/errors.types';
import { handleControllerError } from '../utils/error/errorHandler';

const biwheelInterpretationController = async (req: Request, res: Response) => {
  try {
    const { synastry, compatibility } = req.body;

    if (
      !synastry ||
      typeof synastry !== 'object' ||
      !compatibility ||
      typeof compatibility !== 'object'
    ) {
      throw new ValidationError('Invalid input');
    }

    const result = await getBiwheelInterpretation(synastry, compatibility);

    return res.json({
      status: true,
      interpretation: result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const biwheelControllers = {
  biwheelInterpretationController,
};