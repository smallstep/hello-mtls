import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import template from 'lodash/template';

import topics from '../../src/topics.json';
import Content from '../../src/Content';

import prismCss from 'raw-loader!prismjs/themes/prism-tomorrow.css';

const Page = () => {
  const [doc, setDoc] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function updateDoc() {
      if (router.query.doc) {
        const mod = await import(`../../docs/${router.query.doc}/config.yaml`);
        setDoc(mod.default);
      }
    }
    updateDoc();
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
              <Content content={doc.topics[topic.key].content} />
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
