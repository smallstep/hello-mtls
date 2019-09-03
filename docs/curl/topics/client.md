Pass your certificate, private key, and root CA certificate to `curl` to authenticate your request over TLS.

```shell-session
$ curl --cert {{identity_cert}} --key {{identity_key}} --cacert {{ca_cert}} https://{{identity_name}}
```
