import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Prism from 'prismjs';
import Mustache from 'mustache';
import Ajv from 'ajv';
import readChunk from 'read-chunk';
import imageType from 'image-type';
import sizeOf from 'image-size';

import topics from '../src/topics';
import ContentBlock from '../src/ContentBlock';

const docsPath = path.resolve(__dirname, '../docs');
const docs = fs.readdirSync(docsPath).filter(name => name !== 'LICENSE.txt');

const validTopicFiles = topics.map(topic => `${topic.key}.md`);

docs.forEach(name => {
  test(`${name}: contains only valid files`, () => {
    const docPath = path.resolve(docsPath, name);
    const topicsPath = path.resolve(docPath, 'topics');

    // check for only expected files in the main doc directory
    fs.readdirSync(docPath).forEach(file => {
      if (!['config.yaml', 'logo.png', 'topics'].includes(file)) {
        fail(`Unexpected file ${file}`);
      }
    });

    try {
      // check for only the allowed topics in the topics directory
      fs.readdirSync(topicsPath).forEach(file => {
        if (!validTopicFiles.includes(file)) {
          fail(`Unexpected file topics/${file}`);
        }
      });
    } catch (e) {
      // no topics files;
      return;
    }
  });
});

const ajv = new Ajv();

// json schema to represent config.yaml
const validateConfig = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    protocol: {
      type: 'string',
    },
    server_port: {
      type: 'number',
    },
    topics: {
      type: 'object',
      properties: {
        // use this same structure for all topics
        ...topics.reduce((obj, topic) => {
          obj[topic.key] = {
            type: 'object',
            properties: {
              links: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'string',
                    },
                    url: {
                      type: 'string',
                    },
                  },
                },
              },
            },
            additionalProperties: false,
          };
          return obj;
        }, {}),
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
  required: ['name', 'protocol'],
});

docs.forEach(name => {
  test(`${name}: contains valid config.yaml`, () => {
    const filepath = path.resolve(docsPath, name, 'config.yaml');
    const config = yaml.safeLoad(fs.readFileSync(filepath));

    // validate config.yaml using shcema
    if (!validateConfig(config)) {
      const error = validateConfig.errors[0];

      // error message
      fail(
        `${error.dataPath ? error.dataPath + ' ' : ''}${
          error.message
        } : ${Object.keys(error.params)
          .map(key => key + ' => ' + error.params[key])
          .join(',')}`
      );
    }
  });
});

const VALID_TAGS = [
  'server_name',
  'server_cert',
  'server_key',
  'server_port',
  'client_name',
  'client_cert',
  'client_key',
  'ca_cert',
];

docs.forEach(name => {
  test(`${name}: contains valid topic templates`, () => {
    topics.forEach(topic => {
      const filepath = path.resolve(
        docsPath,
        name,
        'topics',
        `${topic.key}.md`
      );

      let source;
      try {
        // get the raw text
        source = fs.readFileSync(filepath, 'utf8');
      } catch (e) {
        // file doesn't exist
        return;
      }

      Mustache.parse(source)
        .filter(([type]) => type === 'name')
        .forEach(([type, name]) => {
          if (!VALID_TAGS.includes(name)) {
            fail(`${topic.key}.md: Invalid tag '${name}'`);
          }
        });
    });
  });
});

docs.forEach(name => {
  test(`${name}: contains valid Prism.js languages in code blocks`, () => {
    const topicsPath = path.resolve(docsPath, name, 'topics');

    try {
      // get all the topic markdown contents
      const contents = fs
        .readdirSync(topicsPath)
        .map(file => fs.readFileSync(path.resolve(topicsPath, file), 'utf8'));

      // parse languages from code blocks and make sure they exist in prism
      ContentBlock.parseLanguages(contents).forEach(lang => {
        try {
          require.resolve(`prismjs/components/prism-${lang}`);
        } catch (e) {
          fail(
            `Code block language '${lang}' is not a valid Prism.js language.`
          );
        }
      });
    } catch (e) {
      // no topics files
      return;
    }
  });
});

docs.forEach(name => {
  test(`${name}: contains valid logo`, () => {
    const imgPath = path.resolve(docsPath, name, 'logo.png');

    let buffer;
    try {
      // read in the beginning of the file
      buffer = readChunk.sync(imgPath, 0, 12);
    } catch (e) {
      // no logo
      return;
    }

    // check mimetype
    if (imageType(buffer).mime !== 'image/png') {
      fail('Logo is not a valid PNG image');
    }

    // check dimensions
    const dimensions = sizeOf(imgPath);
    if (dimensions.width !== 256 || dimensions.height !== 256) {
      fail('Logo must be 256 x 256 pixels');
    }
  });
});
