const fs = require('fs');
const path = require('path');

module.exports = function() {
  const docsPath = path.resolve(this.context, '../docs');
  const docs = fs.readdirSync(docsPath);
  return `export default ${JSON.stringify(docs)};`;
};
