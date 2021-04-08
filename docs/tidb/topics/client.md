Connect to your TiDB database using `mysql` connection parameters to specify the location of your client certificate, private key, and root CA certificate.

```shell-session
$ mysql --host 127.0.0.1 --port 4000 \
        -u root --ssl-ca={{ ca_cert }} --ssl-mode=VERIFY_CA ]
        --ssl-cert={{ client_cert }} --ssl-key={{ client_key }}"
```
