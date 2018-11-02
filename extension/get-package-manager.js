const fs = require('fs');

module.exports = () => {
  const usesYarn =
    fs.readdirSync(process.cwd()).filter(content => content.includes('yarn'))
      .length > 0;

  return usesYarn ? 'yarn' : 'npm';
};
