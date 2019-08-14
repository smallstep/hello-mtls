import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';

import topics from '../src/topics';
import { toHTML } from '../src/utils';

const docsPath = path.resolve(__dirname, '../docs');
const docs = fs.readdirSync(docsPath).filter(name => name !== 'LICENSE.txt');

const validTopicFiles = topics.map(topic => `${topic.key}.md`);

docs.forEach(name => {
  test(`${name}: contains only valid files`, () => {
    const docPath = path.resolve(docsPath, name);
    const topicsPath = path.resolve(docPath, 'topics');

    fs.readdirSync(docPath).forEach(file => {
      if (!['config.yaml', 'logo.png', 'topics'].includes(file)) {
        fail(`Unexpected file ${file}`);
      }
    });

    try {
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
const validateConfig = ajv.compile({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    topics: {
      type: 'object',
      properties: {
        ...topics.reduce((obj, topic) => {
          obj[topic.key] = {
            type: 'object',
            properties: {
              links: {
                type: 'array',
                items: {
                  type: 'string',
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
  required: ['name'],
});

docs.forEach(name => {
  test(`${name}: contains valid config.yaml`, () => {
    const filepath = path.resolve(docsPath, name, 'config.yaml');
    const config = yaml.safeLoad(fs.readFileSync(filepath));
    if (!validateConfig(config)) {
      const error = validateConfig.errors[0];
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

docs.forEach(name => {
  test(`${name}: contains valid markdown topics`, () => {
    topics.forEach(topic => {
      const filepath = path.resolve(
        docsPath,
        name,
        'topics',
        `${topic.key}.md`
      );

      let source;
      try {
        source = fs.readFileSync(filepath);
      } catch (e) {
        // file doesn't exist
        return;
      }

      try {
        toHTML(source);
      } catch (e) {
        fail(`${topic.key}.md: ${e}`);
      }
    });
  });
});

docs.forEach(name => {
  test(`${name}: contains valid logo`, () => {});
});
