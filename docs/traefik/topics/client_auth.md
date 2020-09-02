Add or configure an existing TLS option to specify the location of your CA root certificate to use for authenticating client certificates.

```toml
# Dynamic configuration

[tls.options]
  [tls.options.default]
    [tls.options.default.clientAuth]
      caFiles = ["{{ ca_cert }}"]
      clientAuthType = "RequireAndVerifyClientCert"
```
