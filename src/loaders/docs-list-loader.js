const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { loadLogo } = require('./utils');

module.exports = function() {
  const docsPath = path.resolve(this.context, '../docs');
  const docNames = fs
    .readdirSync(docsPath)
    .filter(doc => doc !== 'LICENSE.txt');

  const docs = docNames.map(key => {
    const configPath = path.resolve(__dirname, `../../docs/${key}/config.yaml`);
    this.addDependency(configPath);

    const logoPath = path.resolve(__dirname, `../../docs/${key}/logo.png`);
    this.addDependency(logoPath);

    const config = fs.readFileSync(configPath, 'utf8');

    return {
      key,
      name: yaml.safeLoad(config).name,
      logo: loadLogo(logoPath),
    };
  });
  return `export default ${JSON.stringify(docs)};`;
};
