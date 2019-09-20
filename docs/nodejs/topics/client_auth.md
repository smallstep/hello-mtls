In your `https` server, specify the location of your CA root certificate to use for authenticating client certificates.

```javascript
const fs = require('fs');
const https = require('https');

https
  .createServer(
    {
      // ...
      requestCert: true,
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
