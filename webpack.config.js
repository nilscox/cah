const path = require('path');

const paths = {
  appSrc: path.resolve(__dirname, 'web', 'src'),
};

module.exports = {
  resolve: {
    // for WebStorm
    alias: {
      // Custom aliases
      Types: path.resolve(paths.appSrc, '01_types'),
      Actions: path.resolve(paths.appSrc, '02_actions'),
      Reducers: path.resolve(paths.appSrc, '03_reducers'),
      Components: path.resolve(paths.appSrc, '04_components'),
      Styles: path.resolve(paths.appSrc, '05_styles'),
    }
  }
};
