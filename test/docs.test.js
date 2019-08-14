import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';

import topics from '../src/topics';
import { toHTML } from '../src/utils';

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

const docsPath = path.resolve(__dirname, '../docs');
fs.readdirSync(docsPath)
  .filter(name => name !== 'LICENSE.txt')
  .forEach(name => {
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

test('contains valid markdown topics', () => {});

test('contains valid logo images', () => {});
