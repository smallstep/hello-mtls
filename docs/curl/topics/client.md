Pass your certificate, private key, and root CA certificate to `curl` to authenticate your request over TLS.

```shell-session
$ curl --cert {{ client_cert }} --key {{ client_key }} --cacert {{ ca_cert }} https://{{ server_name }}:{{ server_port }}
```
