Copy the `{{ server_cert }}`, `{{ server_key }}`, and `{{ ca_cert }}` files to `/etc/step/certs/`.

```shell-session
$ sudo cat {{ server_cert }} {{ server_key }} > /etc/step/certs/mongod.pem
$ sudo cp {{ ca_cert }} /etc/step/certs/ca.pem
$ sudo chown mongodb:mongodb /etc/step/certs/mongod.pem /etc/step/certs/ca.pem
```

Now you'll need to configure your `/etc/mongodb.conf` to use server authentication.

```yaml
net:
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/step/certs/mongod.pem
```

Restart your mongoDB server for these changes to take effect.
Confirm the configuration by connecting with a mongoDB client:

```shell-session
$ mongo --tls --tlsCAFile /etc/step/certs/{{ ca_cert }}
MongoDB shell version v4.4.3
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("5ddf6126-1b99-4364-a2c5-4262ad2e9d7b") }
MongoDB server version: 4.4.3
Welcome to the MongoDB shell.
...
```
