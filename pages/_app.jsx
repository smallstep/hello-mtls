import githubMarkdownCss from 'raw-loader!github-markdown-css/github-markdown.css';

const App = ({ Component, pageProps }) => (
  <div
    className="markdown-body"
    style={{ margin: '45px auto', width: '100%', maxWidth: '960px' }}
  >
    <style dangerouslySetInnerHTML={{ __html: githubMarkdownCss.toString() }} />
    <Component {...pageProps} />
  </div>
);

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  return { pageProps };
};

export default App;
