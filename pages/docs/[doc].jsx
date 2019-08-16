import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import template from 'lodash/template';
import markdownit from 'markdown-it';
import flatMap from 'lodash.flatmap';

import topics from '../../src/topics.json';
import ContentBlock from '../../src/ContentBlock';

import prismCss from 'raw-loader!prismjs/themes/prism-tomorrow.css';

const md = new markdownit();

const Page = () => {
  const [doc, setDoc] = useState(null);
  const [highlight, setHighlight] = useState(false);

  const router = useRouter();

  async function loadDoc(name) {
    const mod = await import(`../../docs/${name}/config.yaml`);
    const doc = mod.default;
    setDoc(doc);

    const contents = Object.values(doc.topics).map(topic => topic.content);
    const languageImports = flatMap(contents, content =>
      ContentBlock.parseLanguages(content)
    ).map(lang => import(`prismjs/components/prism-${lang}`));
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
      <h1>{doc.name}</h1>

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
