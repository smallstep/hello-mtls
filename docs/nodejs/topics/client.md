Pass your certificate, private key, and root CA certificate to `https.request` to authenticate your request over TLS.

```javascript
const fs = require('fs');
const https = require('https');

const req = https.request(
  {
    hostname: '{{ server_name }}',
    port: {{ server_port }},
    path: '/',
    method: 'GET',
    cert: fs.readFileSync('{{ client_cert }}'),
    key: fs.readFileSync('{{ client_key }}'),
    ca: fs.readFileSync('{{ ca_cert }}')
  },
  res => {
    res.on('data', function(data) {
      // do something with response
    });
  }
);

req.end();
```
