Use `openssl` to package up the client private key and certificate into PKCS12 format. You'll be prompted to create a password here. Hold on to this, as you'll need it in the next step and in configuration later.

```shell-session
$ openssl pkcs12 -export -in {{ client_cert }} -inkey {{ client_key }} -name {{ client_name }} > client.p12
```

Next, use `keytool` to create a Java KeyStore (JKS) with the certificate and key. You'll be prompted to create a new password for the resulting file as well as enter the password for the PKCS12 file from the previous step. Hang onto the new JKS password for use in configuration below.

```shell-session
$ keytool -importkeystore -srckeystore client.p12 -destkeystore kafka.client.keystore.jks -srcstoretype pkcs12 -alias {{ client_name }}
```

**Note:** It's safe to ignore the following warning from `keytool`.

```
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore client.p12 -destkeystore kafka.client.keystore.jks -srcstoretype pkcs12".
```

You'll also need a trust store in JKS format containing the root certificate from your CA. The command line tools will use this trust store to make sure the certificate presented by the broker was signed by your CA. Create the password and agree to trust your CA certificate (type "yes"). Hold onto thie password for this one as well.

```shell-session
$ keytool -keystore kafka.client.truststore.jks -alias CARoot -import -file {{ ca_cert }}
```

Copy your Java KeyStore files into place.

```shell-session
$ sudo mkdir -p /var/private/ssl
$ sudo cp kafka.client.*.jks /var/private/ssl/
$ sudo chown kafka:kafka /var/private/ssl/kafka.client.*.jks
```

Create a new properties file named `client.properties` that you'll reference when you use the command line tools to open a connection. Configure it to use your key store and trust store JKS files.

```ini
security.protocol=SSL
ssl.keystore.location=/var/private/ssl/kafka.client.keystore.jks
ssl.keystore.password=<keystore password>
ssl.key.password=<pkcs12 password>
ssl.truststore.location=/var/private/ssl/kafka.client.truststore.jks
ssl.truststore.password=<truststore password>
```

Since this file contains passwords for your key stores, we'll want to tighten up filesystem permissions.

```shell-session
$ chmod 0600 client.properties
```

Finally, use your `client.properties` file when making connections to a broker from the Kafka command line tools.

```shell-session
$ kafka-console-consumer --bootstrap-server {{ server_name }}:{{ server_port }} -topic mytopic --consumer.config client.properties
$ kafka-console-producer --broker-list {{ server_name }}:{{ server_port }} -topic mytopic --producer.config client.properties
```
