In the dynamic configuration of Traefik specify the locations of the server's certificate and private key. The certificates will be automatically used when the domain in SNI requests matches the certificate domains.

This configuration applies to manually configured certificates. For automatic certificate renewal, check the section below.

```toml
## Dynamic configuration
[[tls.certificates]]
  certFile = "{{ server_cert }}"
  keyFile = "{{ server_key }}"
```

Traefik automatically selects the right certificates when the domain in SNI requests matches the certificate domains. To have one of the certificates be the default certificate - instead of the generated Traefik default certificate - for requests which don't match any certificate configured, you need to configure the default `tls.stores`.

```toml
## Dynamic configuration
[tls.stores]
  [tls.stores.default]
    [tls.stores.default.defaultCertificate]
      certFile = "{{ server_cert }}"
      keyFile  = "{{ server_key }}"
```
