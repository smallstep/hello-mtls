Copy the `{{ server_cert }}`, `{{ server_key }}`, and `{{ ca_cert }}` files to their expected locations in the MySQL data directory. The data directory is often at `/var/lib/mysql` but can be discovered by querying `select @@datadir;` as your MySQL root user.

```shell-session
$ sudo cp {{ server_cert }} /var/lib/mysql/server-cert.pem
$ sudo cp {{ server_key }} /var/lib/mysql/server-key.pem
$ sudo cp {{ ca_cert }} /var/lib/mysql/ca.pem
$ sudo chown msyql:mysql /var/lib/mysql/server-{cert,key}.pem /var/lib/mysql/ca.pem
```

Placing certificates and keys in those file paths should automatically signal to MySQL to allow secure TLS connections, but they can also be configured explicitly. Additionally, we'll need to configure `require_secure_transport` in `my.cnf` to require that TCP clients connect over TLS.

```ini
#...
[mysqld]
ssl-cert=server-cert.pem
ssl-key=server-key.pem
ssl-ca=ca.pem
require_secure_transport=ON
#...
```

Restart your MySQL server for these changes to take effect.
