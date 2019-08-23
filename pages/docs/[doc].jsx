import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import markdownit from 'markdown-it';

import topics from '../../src/topics.json';
import ContentBlock from '../../src/ContentBlock';

import prismCss from 'raw-loader!prismjs/themes/prism-tomorrow.css';

const md = new markdownit();

const Page = () => {
  const [doc, setDoc] = useState(null);
  const [highlight, setHighlight] = useState(false);

  const router = useRouter();

  async function loadDoc(name) {
    // import the specified doc and load it into state
    const mod = await import(`../../docs/${name}/config.yaml`);
    const doc = mod.default;
    setDoc(doc);

    // parse all the languages from the markdown content and load their prism
    // language modules
    const contents = Object.values(doc.topics).map(topic => topic.content);
    const languageImports = ContentBlock.parseLanguages(contents).map(lang =>
      import(`prismjs/components/prism-${lang}`).catch(() =>
        console.log(`"${lang}" is not a valid Prism.js language.`)
      )
    );

    // wait for language module imports, then enable highlighting
    await Promise.all(languageImports);
    setHighlight(true);
  }

  useEffect(() => {
    if (router.query.doc) {
      loadDoc(router.query.doc);
    }
  }, [router.query.doc]);

  if (doc === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: prismCss.toString() }} />
      <h1>
        <img
          src={doc.logo}
          alt={doc.name}
          style={{
            width: '40px',
            verticalAlign: 'middle',
            marginRight: '10px',
          }}
        />
        {doc.name}
      </h1>

      {topics.map(topic => {
        if (!doc.topics || !doc.topics[topic.key]) {
          return null;
        }

        return (
          <div key={topic.key}>
            <h2>{topic.name}</h2>
            {'content' in doc.topics[topic.key] ? (
              <ContentBlock
                content={doc.topics[topic.key].content}
                highlight={highlight}
              />
            ) : (
              'No content'
            )}

            <h3>Links</h3>
            {'links' in doc.topics[topic.key] ? (
              <ul>
                {doc.topics[topic.key].links.map(link => (
                  <li key={link}>
                    <a href={link} target="_blank">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              'No links.'
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Page;
