class CLIError extends Error {
  constructor(message, exit) {
    super(message);
    this.exit = exit || 1;
  }
}

class CLIRequestError extends CLIError {
  constructor(method, route, status, body) {
    super(status + ': ' + route);
    this.method = method;
    this.route = route;
    this.status = status;
    this.body = body;
  }
}

module.exports.CLIError = CLIError;
module.exports.CLIRequestError = CLIRequestError;