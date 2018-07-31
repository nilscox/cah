class Formatter {

  constructor(fields) {
    this.fields = fields;
  }

  format(inst) {
    const values = inst.get();
    const reducer = (data, field) => {
      const value = values[field];

      if (typeof value === 'undefined')
        throw new Error(`Formatter: missing field ${field} in ${inst}`);

      const func = this[`format_${field}`]

      if (typeof func === 'function')
        data[field] = func(value);
      else
        data[field] = value;

      return data;
    };

    return this.fields.reduce(reducer, {});
  }

}

module.exports = Formatter;
