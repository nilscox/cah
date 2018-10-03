module.exports = (key, defaultValue) => {
  const value = process.env[key];

  if (value !== undefined)
    return value;

  if (defaultValue !== undefined)
    return defaultValue;

  /* eslint-disable no-console */
  try { throw new Error('missing env: ' + key); }
  catch (e) { console.error('FATAL', e); }
  finally { process.exit(1); }
  /* eslint-enable no-console */
};
