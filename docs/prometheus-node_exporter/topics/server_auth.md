Copy the `{{ server_cert }}`, `{{ server_key }}`, and `{{ ca_cert }}` files to a `node_exporter` configuration directory. You may need to make a directory for this, eg. `/etc/node_exporter`.

```shell-session
$ sudo cp {{ server_cert }} /etc/node_exporter/server.crt
$ sudo cp {{ server_key }} /etc/node_exporter/server.key
$ sudo cp {{ ca_cert }} /etc/node_exporter/root_ca.crt
```

Make sure these files are owned and readable only by the user that `node_exporter` runs as.

Now create a file called `/etc/node_exporter/web-config.yml`:

```ini
tls_server_config:
  # This is the server certificate for your `node_exporter` server.
  cert_file: "/etc/node_exporter/server.crt"
  key_file: "/etc/node_exporter/server.key"

  # RequireAndVerifyClientCert is the most secure option; clients
  # must present a valid client certificate signed by your CA.
  client_auth_type: "RequireAndVerifyClientCert"

  # This is the CA the client certificate must be signed by.
  client_ca_file: "/etc/node_exporter/root_ca.crt"
```

