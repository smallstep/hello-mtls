import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import markdownit from 'markdown-it';

import { parseTemplate } from './utils';

const ContentBlock = ({ content, data, highlight, className }) => {
  const html = ContentBlock.toHTML(content, data, highlight);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

ContentBlock.parseLanguages = content => {
  const md = new markdownit();
  return md
    .parse(content)
    .filter(token => token.type === 'fence')
    .map(token => token.info);
};

ContentBlock.toHTML = (content, data = {}, highlight = false) => {
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
  return md.render(markdown);
};

ContentBlock.propTypes = {
  content: PropTypes.string.isRequired,
  data: PropTypes.object,
  highlight: PropTypes.bool,
  className: PropTypes.string,
};

ContentBlock.defaultProps = {
  data: {},
  highlight: false,
  className: '',
};

export default ContentBlock;
