const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('lodash.merge');
const topics = require('../topics.json');

const { loadLogo } = require('./utils');

module.exports = function(source) {
  const config = yaml.safeLoad(source);

  const logoPath = path.resolve(this.context, 'logo.png');
  this.addDependency(logoPath);

  const contentTopics = topics.reduce((obj, topic) => {
    const filepath = path.resolve(this.context, `topics/${topic.key}.md`);
    this.addDependency(filepath);

    try {
      obj[topic.key] = {
        content: fs.readFileSync(filepath, 'utf8'),
      };
    } catch (e) {}

    return obj;
  }, {});

  const out = {
    ...config,
    logo: loadLogo(logoPath),
    topics: merge(contentTopics, config.topics),
  };

  return `export default ${JSON.stringify(out)};`;
};
