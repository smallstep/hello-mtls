Copy the `{{ server_cert }}`, `{{ server_key }}`, and `{{ ca_cert }}` files to the directory that contains your TiDB config file.

```shell-session
$ sudo cp {{ server_cert }} /<tidb-config-dir>/server-cert.pem
$ sudo cp {{ server_key }} /<tidb-config-dir>/server-key.pem
$ sudo cp {{ ca_cert }} /<tidb-config-dir>/ca.pem
```

These files should be owned by the user that runs TiDB. Now add the following to your TiDB config file:

```ini
#...
[security]
# Path of file that contains list of trusted SSL CAs for connection with mysql client.
ssl-ca = "ca.pem"

# Path of file that contains X509 certificate in PEM format for connection with mysql client.
ssl-cert = "server-cert.pem"

# Path of file that contains X509 key in PEM format for connection with mysql client.
ssl-key = "server-key.pem"

require-secure-transport=true
#...
```

Restart your TiDB server for these changes to take effect.
