const fs = require('fs');
const path = require('path');

module.exports = function() {
  const docsPath = path.resolve(this.context, '../docs');
  const docs = fs.readdirSync(docsPath).filter(doc => doc !== 'LICENSE.txt');
  return `export default ${JSON.stringify(docs)};`;
};
