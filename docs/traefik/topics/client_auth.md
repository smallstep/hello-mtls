Add or configure an existing TLS option to specify the location of your CA root certificate to use for authenticating client certificates.

```toml
## Dynamic configuration
[tls.options]
  [tls.options.mytlsoptions]
    [tls.options.mytlsoptions.clientAuth]
      caFiles = ["{{ ca_cert }}"]
      clientAuthType = "RequireAndVerifyClientCert"
```

Then, when you add routers to your dynamic configuration for HTTPS traffic, you need to set `tls` and `tls.options` to enable client authentication:

```toml
## Dynamic configuration
[http]
  [http.routers]
    [http.routers.router1]
      ...
      [http.routers.router1.tls]
        options = "mytlsoptions"
```
