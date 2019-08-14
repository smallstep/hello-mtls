import template from 'lodash/template';
import markdownit from 'markdown-it';
import Prism from 'prismjs';

export const toHTML = (content, data = {}, options = {}, callback) => {
  const md = new markdownit({
    highlight:
      options.highlight ||
      ((str, lang) => {
        if (lang) {
          import(`prismjs/components/prism-${lang}`)
            .then(() => {
              callback(
                `<pre class="language-${lang}"><code>${Prism.highlight(
                  str,
                  Prism.languages[lang],
                  lang
                )}</code></pre>`
              );
            })
            .catch(() => {
              callback(
                `<pre class="language-${lang}"><code>${md.utils.escapeHtml(
                  str
                )}</code></pre>`
              );
            });
        }
      }),
  });

  const parse = template(content);
  const markdown = parse({
    identity_name: data.identity_name || 'example.internal.net',
    identity_cert: data.identity_cert || 'example.crt',
    identity_key: data.identity_key || 'example.key',
    ca_cert: data.ca_cert || 'ca.crt',
  });
  return md.render(markdown);
};

export default { toHTML };
