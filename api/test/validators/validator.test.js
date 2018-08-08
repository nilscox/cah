const expect = require('chai').expect;
const { MissingFieldError, ReadOnlyFieldError, ValidationError } = require('../../src/errors');;
const createValidator = require('../../src/validators/validator');

const validator = createValidator({
  a: a => a,
  b: b => b,
});

async function missingField() {
  try {
    await validator.validate({ b: 42 }, { a: { required: true } });
    expect.fail();
  } catch (e) {
    expect(e).to.be.an.instanceof(MissingFieldError);
    expect(e.field).to.eql('a');
  }
}

async function readOnlyField() {
  try {
    await validator.validate({ a: 69, b: 42 }, { a: { readOnly: true } });
    expect.fail();
  } catch (e) {
    expect(e).to.be.an.instanceof(ReadOnlyFieldError);
    expect(e.field).to.eql('a');
  }
}

async function validateFailure() {
  const err = new ValidationError('a', 'a is not valid');
  const validatorThrow = createValidator({
    a: a => { throw err },
  });

  try {
    await validatorThrow.validate({ a: 42 })
    expect.fail();
  } catch (e) {
    expect(e).to.eql(err);
  }
}

async function validateSuccess() {
  let validated = await validator.validate({ a: 69, b: 42 });
  expect(validated).to.deep.eql({ a: 69, b: 42 });

  validated = await validator.validate({ b: 42 }, { a: { required: false } });
  expect(validated).to.deep.eql({ b: 42 });

  validated = await validator.validate({ a: 69 }, { partial: true });
  expect(validated).to.deep.eql({ a: 69 });
}

module.exports = {
  missingField,
  readOnlyField,
  validateFailure,
  validateSuccess,
};
