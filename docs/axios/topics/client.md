Create a custom `https` agent configured with your certificate, private key, and root CA certificate. Pass this agent to axios when you call `axios.get()` (or its respective request method) to authenticate your request over TLS.

```javascript
const fs = require('fs');
const https = require('https');
const axios = require('axios');

// ...
const httpsAgent = new https.Agent({
  cert: fs.readFileSync('{{ client_cert }}'),
  key: fs.readFileSync('{{ client_key }}'),
  ca: fs.readFileSync('{{ ca_cert }}'),
});

const result = await axios.get('https://{{ server_name }}:{{ server_port }}', { httpsAgent });
// do something with the result

// ...
```
