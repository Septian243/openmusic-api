import { ClientError } from '../exceptions/index.js';

const ErrorHandler = (err, req, res, next) => {
  // Handle ClientError and its subclasses
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      status: 'fail',
      message: err.details[0].message,
    });
  }

  // Handle server errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};

export default ErrorHandler;