const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const loaderUtils = require('loader-utils');
const merge = require('lodash/merge');

const topicNames = ['server_auth', 'client_auth', 'client', 'renewal'];

module.exports = function(source) {
  const config = yaml.safeLoad(source);

  const topics = topicNames.reduce((obj, name) => {
    const filepath = path.resolve(this.context, `${name}.md`);
    this.addDependency(filepath);

    try {
      obj[name] = {
        content: fs.readFileSync(filepath, 'utf8'),
      };
    } catch (e) {}

    return obj;
  }, {});

  const out = {
    ...config,
    topics: merge(topics, config.topics),
  };

  return `export default ${JSON.stringify(out)};`;
};
