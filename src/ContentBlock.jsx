import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import unified from 'unified';
import markdown from 'remark-parse';
import ReactMarkdown from 'react-markdown';

import { parseTemplate } from './utils';

const ContentBlock = ({ content, data, renderers, className }) => (
  <ReactMarkdown source={parseTemplate(content, data)} renderers={renderers} />
);

ContentBlock.parseLanguages = values => {
  // get a list of all the languages used in code blocks
  if (!Array.isArray(values)) {
    values = [values];
  }

  const processor = unified().use(markdown);
  return []
    .concat(
      ...values.map(processor.parse.bind(processor)).map(ast => ast.children)
    ) // parse values into nodes
    .filter(node => node.type === 'code') // keep code nodes
    .map(code => code.lang); // get language from code node
};

ContentBlock.propTypes = {
  content: PropTypes.string.isRequired,
  data: PropTypes.object,
  renderers: PropTypes.object,
  className: PropTypes.string,
};

ContentBlock.defaultProps = {
  data: {},
  renderers: {},
  className: '',
};

export default ContentBlock;
