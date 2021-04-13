Copy the `{{ ca_cert }}` file to a `node_exporter` configuration directory. You may need to make a directory for this, eg. `/etc/node_exporter`.

```shell-session
$ sudo cp {{ ca_cert }} /etc/node_exporter/root_ca.crt
```

Make sure these files are owned and readable only by the user that `node_exporter` runs as.

Now modify `/etc/node_exporter/web-config.yml` to require client authentication (in your `tls_server_config` block):

```ini
tls_server_config:
  ...

  # RequireAndVerifyClientCert is the most secure option; clients
  # must present a valid client certificate signed by your CA.
  client_auth_type: "RequireAndVerifyClientCert"

  # This is the CA the client certificate must be signed by.
  client_ca_file: "/etc/node_exporter/root_ca.crt"

  ...
```

