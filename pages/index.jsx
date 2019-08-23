import Link from 'next/link';
import { listDocs } from '../src/utils';

const Page = () => (
  <div>
    <h1>Docs</h1>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {listDocs().map(doc => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            flexBasis: '20%',
            padding: '20px',
            margin: '20px',
          }}
          key={doc.key}
        >
          <Link href="/docs/[doc]" as={`/docs/${doc.key}`}>
            <a>
              <img style={{ width: '100%' }} src={doc.logo} alt={doc.name} />
              {doc.name}
            </a>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default Page;
