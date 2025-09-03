

/**
 * @template T
 * @typedef {Object} ISuccessResponse
 * @property {true} success
 * @property {T} data
 * @property {Object} [meta]
 * @property {string} [meta.message]
 * @property {number} [meta.count]
 */

/**
 * @typedef {Object} IErrorResponse
 * @property {false} success
 * @property {Object} error
 * @property {number} error.code
 * @property {string} error.message
 * @property {*} [error.details]
 */

/**
 * Send a success response
 * @param res Express Response
 * @param data Payload data
 * @param statusCode HTTP status code (default 200)
 * @param meta Optional metadata (message, count, pagination, etc.)
 */
/**
 * Send a success response
 * @template T
 * @param {Response} res Express Response
 * @param {T} data Payload data
 * @param {number} [statusCode=200] HTTP status code (default 200)
 * @param {Object} [meta] Optional metadata (message, count, pagination, etc.)
 */
export const SuccessResponse = (
  res,
  data,
  statusCode = 200,
  meta
) => {
  const response = { success: true, data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};
/**
 * Send an error response
 * @param {Response} res Express Response
 * @param {number} code HTTP status code
 * @param {string} message Error message
 * @param {*} [details] Extra details (optional)
 */
export const ErrorResponse = (
  res,
  code,
  message,
  details
) => {
  const response = {
    success: false,
    error: { code, message, details },
  };
  res.status(code).json(response);
};
