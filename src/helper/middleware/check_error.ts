import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validationResult } from 'express-validator/check';

export const checkError: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!validationResult(req).isEmpty()) {
    res.send({ err: validationResult(req).array() });
  } else {
    next();
  }
};
