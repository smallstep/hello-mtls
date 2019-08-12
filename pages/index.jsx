import Link from 'next/link';

import docs from '../build/index.json';

const Page = () => (
  <div>
    <h1>Docs</h1>
  <ul>
    {docs.docs.map(doc => (
      <li key="{doc}">
        <Link href="/docs/[doc]" as={`/docs/${doc}`}>
          {doc}
        </Link>
      </li>
    ))}
  </ul>
  </div>
);

export default Page;
