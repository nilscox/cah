const validators = require('./validators');

describe('validator', () => {
  const { validator } = validators;

  it('should validate a model with a missing required field', validator.missingField);
  it('should validate a model with a given read only field', validator.readOnlyField);
  it('should validate a model with a failing field', validator.validateFailure);
  it('should validate a model', validator.validateSuccess);

});
