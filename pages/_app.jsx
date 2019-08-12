import githubMarkdownCss from 'github-markdown-css/github-markdown.css';

const App = ({ Component, pageProps }) => (
  <div
    className="markdown-body"
    style={{ margin: '45px auto', width: '100%', maxWidth: '960px' }}
  >
    <style dangerouslySetInnerHTML={{ __html: githubMarkdownCss.toString() }} />

    <Component {...pageProps} />
  </div>
);

export default App;
