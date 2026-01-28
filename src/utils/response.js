const response = (res, statusCode, status, message, data = null) => {
  const responseBody = {
    status,
    message,
  };

  if (data !== null) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody).end();
};

export default response;