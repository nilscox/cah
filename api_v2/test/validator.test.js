const expect = require('chai').expect;

const Validator = require('../validators/validator');

describe('validator', () => {

  it('should not create a validator without a missing validation method', () => {
    class SomeValidator extends Validator {
      constructor() {
        super(['toto']);
      }
    };

    expect(() => new SomeValidator()).to.throw();
  });

  it('should validate an object', () => {
    class SomeValidator extends Validator {
      constructor() {
        super([]);
      }
    };

    expect(() => new SomeValidator().validate()).to.not.throw();
  });

  it('should throw an error in a validation method', () => {
    class SomeValidator extends Validator {
      constructor() {
        super(['toto']);
      }

      validate_toto(value) {
        if (value !== 42)
          throw new Error('value must be 42');
      }
    };

    new SomeValidator().validate({ toto: 69 })
      .then(() => expect.fail('validation must fail'))
      .catch(err => expect(err).to.be.an('Error'));
  });

});
