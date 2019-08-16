import Link from 'next/link';
import { listDocs } from '../src/utils';

const Page = () => (
  <div>
    <h1>Docs</h1>
    <ul>
      {listDocs().map(doc => (
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
