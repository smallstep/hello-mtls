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

**An important note**

For additional security, step certificates are signed by an intermediate CA by default rather than the root CA. The intermediate certificate is bundled into your `{{ server_cert }}` file.

Unfortunately, MySQL has an [outstanding bug](https://bugs.mysql.com/bug.php?id=54158) that prevents it from being able to read the intermediate certificate out of `{{ server_cert }}`. So, when opening a connection from a MySQL client, we'll have to instead bundle that intermediate CA certificate together with the root CA certificate we saved previously (`{{ ca_cert }}`) and pass it into our client so that MySQL can read it and verify the server certificate that was signed by your CA's intermediate. This is covered in the Hello mTLS MySQL client docs.
