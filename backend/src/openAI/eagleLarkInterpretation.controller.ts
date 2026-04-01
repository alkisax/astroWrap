// backend/src/openAI/eagleLarkInterpretation.controller.ts

import { Request, Response } from 'express'
import { getEagleAndLarkInterpretation } from './eagleAndLarkInterpretation.service'
import { ValidationError } from '../utils/error/errors.types'
import { handleControllerError } from '../utils/error/errorHandler'

const eagleLarkInterpretationController = async (req: Request, res: Response) => {
  try {
    const { payload } = req.body

    // basic validation
    if (!payload || typeof payload !== 'object') {
      throw new ValidationError('Invalid payload data')
    }

    const result = await getEagleAndLarkInterpretation(payload)

    return res.json({
      status: true,
      interpretation: result,
    })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export const eagleLarkControllers = {
  eagleLarkInterpretationController,
}