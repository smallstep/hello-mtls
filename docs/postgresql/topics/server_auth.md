To start PostgreSQL in SSL mode, first enable SSL in `postgresql.conf`.

```ini
# ...
ssl = on
# ...
```

Put your `{{ server_cert }}` and `{{ server_key }}` files in your installation's data directory, often at `/var/lib/pgsql/data` or `/usr/local/pgsql/data`. Make sure their filenames are `server.crt` and `server.key` respectively, which are the expected defaults.

```shell-session
$ sudo cp {{ server_cert }} /var/lib/pgsql/data/server.crt
$ sudo cp {{ server_key }} /var/lib/pgsql/data/server.key
```

You'll need to ensure that PostgreSQL has access to the files and set the private key file permissions to disallow access to world or group.

```shell-session
$ sudo chown postgres:postgres /var/lib/pgsql/data/server.{crt,key}
$ sudo chmod 0600 /var/lib/pgsql/data/server.key
```

If you'd like to specify a different path for these files, manually configure them in `postgresql.conf`.

```ini
# ...
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'
# ...
```

In your `pg_hba.conf` file, change all records for non-local connections from `host` to `hostssl` to require clients to connect over TLS. It might look something like this.

``` ini
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# ...
hostssl all             all             all                     md5
```

Finally, restart your PostgreSQL server for your changes to take effect.
