import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.error(error);
  res.status(500).json({ error });
};
