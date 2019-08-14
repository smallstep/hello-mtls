import template from 'lodash/template';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt();

export const toHTML = (content, data) => {
  const html = markdown.render(content);
  const parse = template(html);
  return parse({
    identity_name: data.identity_name || 'example.internal.net',
    identity_cert: data.identity_cert || 'example.crt',
    identity_key: data.identity_key || 'example.key',
    ca_cert: data.ca_cert || 'ca.crt',
  });
};

export default { toHTML };
