const fs = require('fs');
const path = require('path');

const loadLogo = filepath => {
  let content;
  try {
    content = fs.readFileSync(filepath);
  } catch (e) {
    const dummyPath = path.resolve(__dirname, '../graphics/dummy.png');
    content = fs.readFileSync(dummyPath);
  }
  const data = new Buffer(content).toString('base64');
  return `data:image/png;base64,${data}`;
};

module.exports = { loadLogo };
