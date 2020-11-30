Now let's configure Prometheus to authenticate in the role of client to your `node_exporter` server. Here's an example job configuration block that you'd add to your `prometheus.yml`:

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
    - targets: ['node_exporter_node:9100']
#...
```

Reload Prometheus, and confirm that the Prometheus dashboard shows your node_exporter target endpoints as "UP"—and using the `https://` scheme.