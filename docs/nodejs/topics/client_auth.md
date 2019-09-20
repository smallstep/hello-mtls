In your `https` server, specify the location of your CA root certificate to use for authenticating client certificates.

In this case, we instruct our server to request client certificates, but not to reject unauthorized requests so that we can check for authorization later and provide a friendly message on client authentication failures.

```javascript
const fs = require('fs');
const https = require('https');

https
  .createServer(
    {
      // ...
      requestCert: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync('{{ ca_cert }}'),
      // ...
    },
    (req, res) => {
      if (!req.client.authorized) {
        res.writeHead(401);
        return res.end('Invalid client certificate authentication.');
      }

      res.writeHead(200);
      res.end('Hello, world!');
    }
  )
  .listen(9443);
```
