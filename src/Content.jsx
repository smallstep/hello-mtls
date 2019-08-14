import PropTypes from 'prop-types';

import { toHTML } from './utils';

const Content = ({ content, data }) => (
  <div dangerouslySetInnerHTML={{ __html: toHTML(content, data) }} />
);

Content.propTypes = {
  content: PropTypes.string.isRequired,
  data: PropTypes.object,
};

Content.defaultProps = {
  data: {},
};

export default Content;
