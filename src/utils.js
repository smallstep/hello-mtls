import Mustache from 'mustache';

import docs from './docs';

export const listDocs = () => docs;

export const parseTemplate = (content, data = {}) => {
  // interpolate variables into markdown template
  return Mustache.render(content, {
    server_name: data.server_name || 'example.internal.net',
    server_cert: data.server_cert || 'example.crt',
    server_key: data.server_key || 'example.key',
    client_name: data.client_name || 'example.internal.net',
    client_cert: data.client_cert || 'example.crt',
    client_key: data.client_key || 'example.key',
    ca_cert: data.ca_cert || 'ca.crt',
  });
};
