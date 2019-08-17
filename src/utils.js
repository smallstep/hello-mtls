import template from 'lodash.template';

import docs from './docs';

export const listDocs = () => docs;

export const parseTemplate = (content, data = {}) => {
  // interpolate variables into markdown template
  const parse = template(content);
  return parse({
    identity_name: data.identity_name || 'example.internal.net',
    identity_cert: data.identity_cert || 'example.crt',
    identity_key: data.identity_key || 'example.key',
    ca_cert: data.ca_cert || 'ca.crt',
  });
};
