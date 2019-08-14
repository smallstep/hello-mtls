import Link from 'next/link';
import docs from '../src/docs';

const Page = () => (
  <div>
    <h1>Docs</h1>
    <ul>
      {docs.map(doc => (
        <li key={doc}>
          <Link href="/docs/[doc]" as={`/docs/${doc}`}>
            <a>{doc}</a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Page;
