For additional security, step certificates are signed by an intermediate CA by default rather than the root CA. The intermediate certificate is bundled into your `{{ server_cert }}` certificate (configured on the server side).

Unfortunately, MySQL has an [outstanding bug](https://bugs.mysql.com/bug.php?id=54158) that prevents it from being able to read the intermediate certificate out of `{{ server_cert }}`. So, we'll have to instead bundle that intermediate CA certificate together with the root CA certificate we saved previously (`ca.crt`) so that our MySQL client can read it and verify the server certificate was signed by your intermediate CA.

```shell-session
$ step certificate bundle $(step path)/certs/intermediate_ca.crt {{ ca_cert }} ca-bundle.crt
```

Pass your certificate, private key, and the CA bundle to your MySQL client to authenticate your connection over TLS. The SSL mode `VERIFY_IDENTITY` instructs MySQL to verify that the name in our server certificate matches the hostname for the connection, which offers the tightest security.

```shell-session
$ mysql -h {{ server_name }} -P {{ server_port }} -u {{ client_name }} -p --ssl-mode=VERIFY_IDENTITY --ssl-cert={{ client_cert }} --ssl-key={{ client_key }} --ssl-ca=ca-bundle.crt
```

It's also possible to configure those arguments in the `[client]` section of your `my.cnf` file to be used on every connection:

```ini
#...

[client]
# ...
ssl-mode=VERIFY_IDENTITY
ssl-cert=/path/to/{{ client_cert }}
ssl-key=/path/to/{{ client_key }}
ssl-ca=/path/to/ca-bundle.crt

# ...
```

Then, they can be dropped from the CLI client command.

```shell-session
$ mysql -h {{ server_name }} -P {{ server_port }} -u {{ client_name }} -p
```
