Traefik is a modern reverse-proxy with integrated support for ACME. It's easy to get a certificate from Let's Encrypt andy other ACME compatible CAs like `step-ca` in Traefik, using the `tls-alpn-01` ACME challenge type.

Most importantly, Traefik will need to trust your root CA certificate. Either use the `LEGO_CA_CERTIFICATES` environment variable to provide the full path to your `{{ ca_cert }}` when running Traefik, or install your root certificate in your system's trust store.

In your Traefik static configuration, you'll need to add a `certificatesResolvers` block:

```toml
[certificatesResolvers]
  [certificatesResolvers.myresolver]
    [certificatesResolvers.myresolver.acme]
      caServer = "https://step-ca.internal/acme/acme/directory"
      email = "anna@example.com"
      storage = "acme.json"
      tlsChallenge = true
```

Then, when you add routers to your dynamic configuration for HTTPS traffic, you need to set `tls` and `tls.certResolver`:

```toml
## Dynamic configuration
[http]
  [http.routers]
    [http.routers.router1]
      ...
      [http.routers.router1.tls]
        certResolver = "myresolver"
```
