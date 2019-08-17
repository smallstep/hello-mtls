import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import markdownit from 'markdown-it';

let Prism;
try {
  // fail silently since highlight is optional (prism is a peer dep)
  Prism = require('prismjs');
} catch (e) {}

import { parseTemplate } from './utils';

const ContentBlock = ({ content, data, highlight, className }) => {
  // render markdown template content to html
  const html = ContentBlock.toHTML(content, data, highlight);
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

ContentBlock.parseLanguages = contents => {
  // get a list of all the languages used in code blocks
  if (!Array.isArray(contents)) {
    contents = [contents];
  }

  const md = new markdownit();
  return []
    .concat(...contents.map(md.parse.bind(md))) // parse contents into tokens
    .filter(token => token.type === 'fence') // keep fence tokens
    .map(fence => fence.info); // get language from fence token
};

ContentBlock.toHTML = (content, data = {}, highlight = false) => {
  // convert markdown template content into html (with optional prism syntax highlight)
  const md = new markdownit({
    highlight: (str, lang) => {
      if (highlight && Prism && lang && lang in Prism.languages) {
        // use prism to highlight
        return `<pre class="language-${lang}"><code>${Prism.highlight(
          str,
          Prism.languages[lang],
          lang
        )}</code></pre>`;
      }

      if (highlight && !Prism) {
        // prism isn't available
        console.log(
          "Prism.js could not be found, but you've attempted to enable syntax highlighting. Are you sure it's installed in your project dependencies?"
        );
      }

      if (highlight && Prism && lang && !(lang in Prism.languages)) {
        // the language wasn't imported
        console.log(
          `Content contains a code block with language "${lang}", but it could not be found in Prism.js. Are you sure you imported the language from Prism.js?`
        );
      }

      // return un-highlighted code
      return `<pre class="language-${lang}"><code>${md.utils.escapeHtml(
        str
      )}</code></pre>`;
    },
  });

  // interpolate template variables and render markdown to html
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
