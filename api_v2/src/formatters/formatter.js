class Formatter {

  constructor(fields) {
    this.fields = fields;
  }

  format(inst, opts = {}) {
    const fields = Object.keys(this.fields);

    const formatInstance = async inst => {
      const data = {};

      for (let i = 0; i < fields.length; ++i) {
        const field = fields[i];
        const formatter = this.fields[field];

        const value = await formatter(inst);

        if (typeof value !== 'undefined')
          data[field] = value;
      }

      return data;
    };

    return opts.many
      ? Promise.all(inst.map(i => formatInstance(i)))
      : formatInstance(inst);
  }

}

module.exports = Formatter;
