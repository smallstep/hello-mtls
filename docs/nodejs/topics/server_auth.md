In your `https` server, specify the locations of the server's certificate and private key.

```javascript
const fs = require('fs');
const https = require('https');

https
  .createServer(
    {
      // ...
      cert: fs.readFileSync('{{ server_cert }}'),
      key: fs.readFileSync('{{ server_key }}')
      // ...
    },
    (req, res) => {
      res.writeHead(200);
      res.end('Hello, world!');
    }
  )
  .listen(9443);
```
