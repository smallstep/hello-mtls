import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import template from 'lodash.template';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt();

const templateData = {
  identity_name: 'example.internal.net',
  identity_cert: 'example.crt',
  identity_key: 'example.key',
  ca_cert: 'ca.crt',
};

const renderContent = (content, data) => {
  const parse = template(content);
  const parsed = parse(data);
  return markdown.render(parsed);
};

const Page = () => {
  const [doc, setDoc] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function updateDoc() {
      if (router.query.doc) {
        const doc = await import(`../../build/${router.query.doc}.json`);
        setDoc(doc);
      }
    }
    updateDoc();
  }, [router.query.doc]);

  if (doc === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{doc.name}</h1>

      <h2>Server authentication</h2>
      <div
        dangerouslySetInnerHTML={{
          __html:
            renderContent(doc.server_auth.content, templateData) ||
            'No content.',
        }}
      />
      <h3>Links</h3>
      {doc.server_auth && doc.server_auth.links ? (
        <ul>
          {doc.server_auth.links.map(link => (
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
      <div
        dangerouslySetInnerHTML={{
          __html:
            renderContent(doc.client_auth.content, templateData) ||
            'No content.',
        }}
      />
      <h3>Links</h3>
      {doc.client_auth && doc.client_auth.links ? (
        <ul>
          {doc.client_auth.links.map(link => (
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
      <div
        dangerouslySetInnerHTML={{
          __html:
            renderContent(doc.client.content, templateData) || 'No content.',
        }}
      />
      <h3>Links</h3>
      {doc.client && doc.client.links ? (
        <ul>
          {doc.client.links.map(link => (
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
