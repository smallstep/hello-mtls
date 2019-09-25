We'll demonstrate how to configure an individual Kafka broker/machine. You'll need to issue a new certificate and repeat these steps for each broker in your Kafka cluster.

If you haven't already, create a JKS trust store for your Kafka broker containing your root CA certificate. Kafka will use this certificate to verify any client certificates are valid and issued by your CA. Hang onto the password you create for your server configuration.

```shell-session
$ keytool -keystore kafka.server.truststore.jks -alias CARoot -import -file {{ ca_cert }}
```
Add configurations for the trust store to `server.properties`.

```ini
# ...
ssl.truststore.location=/path/to/kafka.server.truststore.jks
ssl.truststore.password=<truststore password>
# ...
```

Lastly, configure `server.properties` to require that clients authenticate with certificates whenever they connect.

```ini
# ...
ssl.client.auth=required
# ...
```

Restart your Kafka server (and possibly ZooKeeper) for your changes to take effect.
