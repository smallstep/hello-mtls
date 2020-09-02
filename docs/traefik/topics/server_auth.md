In the dynamic configuration of Traefik specify the locations of the server's certificate and private key. The certificates will be automatically used when the domain in SNI requests matches the certificate domains.

```toml
# Dynamic configuration

[[tls.certificates]]
  certFile = "{{ server_cert }}"
  keyFile = "{{ server_key }}"
```
