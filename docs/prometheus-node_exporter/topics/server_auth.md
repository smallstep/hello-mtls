Copy the `{{ server_cert }}` and `{{ server_key }}` files to a `node_exporter` configuration directory. You may need to make a directory for this, eg. `/etc/node_exporter`.

```shell-session
$ sudo cp {{ server_cert }} /etc/node_exporter/server.crt
$ sudo cp {{ server_key }} /etc/node_exporter/server.key
```

Make sure these files are owned and readable only by the user that `node_exporter` runs as.

Now create a file called `/etc/node_exporter/web-config.yml` and configure your `tls_server_config` block to use the server certificate and key:

```ini
tls_server_config:
  # This is the server certificate for your `node_exporter` server.
  cert_file: "/etc/node_exporter/server.crt"
  key_file: "/etc/node_exporter/server.key"

  ...
```

