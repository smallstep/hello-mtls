import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { toHTML } from './utils';

const Content = ({ content, data }) => {
  const [html, setHtml] = useState();

  useEffect(() => {
    toHTML(content, data, {}, setHtml);
  }, [content, data]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

Content.propTypes = {
  content: PropTypes.string.isRequired,
  data: PropTypes.object,
};

Content.defaultProps = {
  data: {},
};

export default Content;
