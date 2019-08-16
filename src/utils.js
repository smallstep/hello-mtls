import template from 'lodash.template';

import docs from './docs';

export const listDocs = () => Promise.resolve(docs);
export const getDoc = name =>
  import(`../docs/${name}/config.yaml`).then(mod => mod.default);

export const parseTemplate = (content, data = {}) => {
  const parse = template(content);
  return parse({
    identity_name: data.identity_name || 'example.internal.net',
    identity_cert: data.identity_cert || 'example.crt',
    identity_key: data.identity_key || 'example.key',
    ca_cert: data.ca_cert || 'ca.crt',
  });
};
