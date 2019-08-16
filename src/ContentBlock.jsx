import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import markdownit from 'markdown-it';

import { parseTemplate } from './utils';

const toHTML = (content, data = {}, highlight = true) => {
  const md = new markdownit({
    highlight: (str, lang) => {
      if (highlight && lang) {
        return `<pre class="language-${lang}"><code>${Prism.highlight(
          str,
          Prism.languages[lang],
          lang
        )}</code></pre>`;
      }

      return `<pre class="language-${lang}"><code>${md.utils.escapeHtml(
        str
      )}</code></pre>`;
    },
  });

  const markdown = parseTemplate(content, data);

  if (highlight) {
    const languageImports = md
      .parse(markdown)
      .filter(token => token.type === 'fence')
      .map(token => import(`prismjs/components/prism-${token.info}`));
    return Promise.all(languageImports).then(() => md.render(markdown));
  }

  return md.render(markdown);
};

const ContentBlock = ({ content, data }) => {
  const [html, setHtml] = useState(toHTML(content, data, false));

  useEffect(() => {
    toHTML(content, data).then(result => setHtml(result));
  }, [content, data]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

ContentBlock.propTypes = {
  content: PropTypes.string.isRequired,
  data: PropTypes.object,
};

ContentBlock.defaultProps = {
  data: {},
};

export default ContentBlock;
