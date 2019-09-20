In your `https` server, specify the location of your CA root certificate to use for authenticating client certificates.

```javascript
import fs from 'fs';
import https from 'https';

https
  .createServer(
    {
      // ...
      ca: fs.readFileSync('{{ ca_cert }}'),
      // ...
    },
    (req, res) => {
      res.writeHead(200);
      res.end('Hello, world!');
    }
  )
  .listen(9433);
```
