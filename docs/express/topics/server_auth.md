Using the `https` module (instead of `app.listen()`) to start your server, specify the locations of the server's certificate and private key.

```javascript
const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  return res.send('Hello, world!');
});

https
  .createServer(
    {
      // ...
      cert: fs.readFileSync('{{ server_cert }}'),
      key: fs.readFileSync('{{ server_key }}'),
      // ...
    },
    app
  )
  .listen(9443);
```
