Using the `https` module (instead of `app.listen()`) to start your server, specify the location of your CA root certificate to use for authenticating client certificates.

In this case, we instruct our server to request client certificates, but not to reject unauthorized requests so that we can check for authorization later and provide a friendly message on client authentication failures.

```javascript
const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  if (!req.client.authorized) {
    return res.status(401).send('Invalid client certificate authentication.');
  }

  return res.send('Hello, world!');
});

https
  .createServer(
    {
      // ...
      requestCert: true,
      rejectUnauthorized: false,
      ca: fs.readFileSync('{{ ca_cert }}'),
      // ...
    },
    app
  )
  .listen(9443);
```

It's also possible to turn the above into an express middleware to authenticate on every request:

```javascript
// ...

const clientAuthMiddleware = () => (req, res, next) => {
  if (!req.client.authorized) {
    return res.status(401).send('Invalid client certificate authentication.');
  }
  return next();
};

const app = express();
app.use(clientAuthMiddleware());

// ...
```
