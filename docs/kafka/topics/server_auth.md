We'll demonstrate how to configure an individual Kafka broker/machine. You'll need to issue a new certificate and repeat these steps for each broker in your Kafka cluster.

Use `openssl` to package up the server private key and certificate into PKCS12 format. You'll be prompted to create a password here. Hold on to this, as you'll need it in the next step and in configuration later.

```shell-session
$ openssl pkcs12 -export -in {{ server_cert }} -inkey {{ server_key }} -name {{ server_name }} > server.p12
```

Next, use `keytool` to create a Java KeyStore (JKS) with the certificate and key for use by Kafka. 
You'll be prompted to create a new password for the resulting file as well as enter the password for the PKCS12 file from the previous step. 
Hang on to the new JKS password for use in configuration below.

```shell-session
$ keytool -importkeystore -srckeystore server.p12 -destkeystore kafka.server.keystore.jks -srcstoretype pkcs12 -alias {{ server_name }}
```

**Note:** It's safe to ignore the following warning from `keytool`.

```
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore server.p12 -destkeystore kafka.server.keystore.jks -srcstoretype pkcs12".
```

You'll also need a trust store in JKS format containing the root certificate from your CA. Kafka brokers will use this trust store to make sure certificates presented by clients and other brokers were signed by your CA. Create the password and agree to trust your CA certificate (type "yes"). Hold onto this password for this one as well.

```shell-session
$ keytool -keystore kafka.server.truststore.jks -alias CARoot -import -file {{ ca_cert }}
```

In your Kafka configuration directory, modify `server.properties` to remove any plain text listeners and require SSL (TLS). You'll also want to require that Kafka brokers only speak to each other over TLS.

```ini
#...
listeners=SSL://:9093
security.inter.broker.protocol=SSL
#...
```

If `advertised.listeners` is also configured, you may choose to either comment it out or configure it to use SSL (TLS) as well.

```ini
#...
advertised.listeners=SSL://:9093
#...
```

Copy your Java KeyStore files into place.

```shell-session
$ sudo mkdir -p /var/private/ssl
$ sudo cp kafka.server.*.jks /var/private/ssl/
$ sudo chown kafka:kafka /var/private/ssl/kafka.server.*.jks
```

Reference them in `server.properties` and provide the passwords you created for each.

```ini
#...
ssl.keystore.location=/var/private/ssl/kafka.server.keystore.jks
ssl.keystore.password=<keystore password>
ssl.key.password=<pkcs12 password>
ssl.truststore.location=/var/private/ssl/kafka.server.truststore.jks
ssl.truststore.password=<truststore password>
#...
```

Restart your Kafka server for your changes to take effect.
