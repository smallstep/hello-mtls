const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getOptions } = require('loader-utils');

const { loadLogo } = require('./utils');
const topics = require('../topics.json');

module.exports = function() {
  const options = getOptions(this);
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

    const availableTopics = topics.reduce((topics, topic) => {
      if (config.topics && topic.key in config.topics) {
        return topics.add(topic.key);
      }

      try {
        const topicPath = path.resolve(
          __dirname,
          `../../docs/${key}/topics/${topic.key}.md`
        );
        this.addDependency(topicPath);
        fs.readFileSync(topicPath);
        return topics.add(topic.key);
      } catch (e) {}

      return topics;
    }, new Set([]));

    return {
      key,
      name: yaml.safeLoad(config).name,
      logo: loadLogo(logoPath, this.mode, options.asset_url),
      availableTopics: Array.from(availableTopics),
    };
  });
  return `export default ${JSON.stringify(docs)};`;
};
