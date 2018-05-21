module.exports = {
  aliases: {
    '~': 'src'
  },
  importStatementFormatter({ importStatement }) {
    return importStatement.replace(/((\.\.\/)+)/, '~/');
  },
}