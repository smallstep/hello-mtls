const fs = require('fs');
const yaml = require('js-yaml');

const readFile = path => fs.readFileSync(path, 'utf8');
const readYaml = path => yaml.safeLoad(readFile(path));
const writeFile = (path, data) =>
  fs.writeFileSync(path, JSON.stringify(data, null, 2));

// create build dir
try {
  fs.mkdirSync('./build');
} catch (e) {}

// read all docs
const docs = fs.readdirSync('./docs');

// write index file
writeFile('./build/index.json', { docs });

// write json file for each doc
docs.forEach(doc => {
  const docPath = `./docs/${doc}`;
  const config = readYaml(`${docPath}/config.yaml`);

  let serverAuthContent;
  try {
    serverAuthContent = { content: readFile(`${docPath}/server_auth.md`) };
  } catch (e) {
    serverAuthContent = {};
  }

  let clientAuthContent;
  try {
    clientAuthContent = { content: readFile(`${docPath}/client_auth.md`) };
  } catch (e) {
    clientAuthContent = {};
  }

  let clientContent;
  try {
    clientContent = { content: readFile(`${docPath}/client.md`) };
  } catch (e) {
    clientContent = {};
  }

  const out = {
    ...config,
    server_auth: {
      ...serverAuthContent,
      ...config.server_auth,
    },
    client_auth: {
      ...clientAuthContent,
      ...config.client_auth,
    },
    client: {
      ...clientContent,
      ...config.client,
    },
  };

  writeFile(`./build/${doc}.json`, out);
});

console.log('Docs rebuilt successfully.');
