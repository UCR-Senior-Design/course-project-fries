class HttpError extends Error {
  constructor(message, error_code) {
    super(message);
    this.code = error_code;
  }
}

module.exports = HttpError;
