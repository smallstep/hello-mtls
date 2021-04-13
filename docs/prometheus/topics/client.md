Add the following job configuration block to your `prometheus.yml` to authenticate as a client to your targets:

```yaml
#...
scrape_configs:
  - job_name: 'node'

    scheme: https
    tls_config:
        # Prometheus will check that the node_exporter presents a certificate
        # signed by this ca.
        ca_file: '{{ ca_cert }}'
        # The cert and key are presented to node_exporter to authenticate
        # Prometheus as a client.
        cert_file: '{{ client_cert }}'
        key_file: '{{ client_key }}'

    static_configs:
    - targets: ['{{ server_name }}:{{ server_port }}']
#...
```

Reload Prometheus, and confirm that the Prometheus dashboard shows your target endpoints as "UP"—and using the `https://` scheme.
