import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import template from 'lodash/template';

import Content from '../../src/Content';

import prismCss from 'prismjs/themes/prism-tomorrow.css';

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
      <h2>Server authentication</h2>
      {doc.topics.server_auth && doc.topics.server_auth.content ? (
        <Content content={doc.topics.server_auth.content} />
      ) : (
        'No content'
      )}
      <h3>Links</h3>
      {doc.topics.server_auth && doc.topics.server_auth.links ? (
        <ul>
          {doc.topics.server_auth.links.map(link => (
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
      <h2>Client authentication</h2>
      {doc.topics.client_auth && doc.topics.client_auth.content ? (
        <Content content={doc.topics.client_auth.content} />
      ) : (
        'No content'
      )}
      <h3>Links</h3>
      {doc.topics.client_auth && doc.topics.client_auth.links ? (
        <ul>
          {doc.topics.client_auth.links.map(link => (
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
      <h2>Client requests</h2>
      {doc.topics.client && doc.topics.client.content ? (
        <Content content={doc.topics.client.content} />
      ) : (
        'No content'
      )}
      <h3>Links</h3>
      {doc.topics.client && doc.topics.client.links ? (
        <ul>
          {doc.topics.client.links.map(link => (
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
      <h2>Certificate renewal</h2>
      {doc.topics.renewal && doc.topics.renewal.content ? (
        <Content content={doc.topics.renewal.content} />
      ) : (
        'No content'
      )}
      <h3>Links</h3>
      {doc.topics.renewal && doc.topics.renewal.links ? (
        <ul>
          {doc.topics.renewal.links.map(link => (
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
};

export default Page;
