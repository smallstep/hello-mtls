Connect to your PostgreSQL database using `psql` connection parameters to specify the location of your client certificate, private key, and root CA certificate.

Setting the `sslmode` parameter to `verify-full` also ensures that the PostgreSQL server name matches the name in the certificate it presents to clients.

```shell-session
$ psql "host={{ server_name }} user=myuser dbname=mydatabase sslmode=verify-full sslcert={{ client_cert }} sslkey={{ client_key }} sslrootcert={{ ca_cert }}"
```

As an alternative, if you'd like to avoid specifying file paths on each connection, you can copy them to your `psql` client's configuration directory.

```shell-session
$ mkdir -p ~/.postgresql
$ cp {{ ca_cert }} ~/.postgresql/root.crt
$ cp {{ client_cert }} ~/.postgresql/postgresql.crt
$ cp {{ client_key }} ~/.postgresql/postgresql.key
```

The connection command then becomes only the following:

```shell-session
$ psql "host={{ server_name }} user=myuser dbname=mydatabase sslmode=verify-full"
```
