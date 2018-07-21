class Formatter {

  constructor(fields) {
    this.fields = fields;
  }

  format(entity) {
    const values = entity.get();
    const reducer = (data, field) => {
      const value = values[field];

      if (typeof value === 'undefined')
        throw new Error(`Formatter: missing field ${field} in ${entity}`);

      if (typeof this[field] === 'function')
        data[field] = this[field](value);
      else
        data[field] = value;

      return data;
    };

    return this.fields.reduce(reducer, {});
  }

}

module.exports = Formatter;
