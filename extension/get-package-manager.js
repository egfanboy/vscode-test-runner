const fs = require('fs');

module.exports = rootPath => {
  const usesYarn =
    fs.readdirSync(rootPath).filter(content => content.includes('yarn'))
      .length > 0;

  return usesYarn ? 'yarn' : 'npm';
};
