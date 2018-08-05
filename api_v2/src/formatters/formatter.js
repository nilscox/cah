module.exports = fields => (inst, opts = {}) => {
  const keys = Object.keys(fields);

  const formatInstance = async inst => {
    const data = {};

    for (let i = 0; i < keys.length; ++i) {
      const field = keys[i];
      const formatter = fields[field];

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
