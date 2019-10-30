Use `openssl` to package up the server private key and certificate into PKCS12 format. You'll be prompted to create a password here. Hold on to this, as you'll need it in the next step and in configuration later.

```shell-session
$ openssl pkcs12 -export -in {{ server_cert }} -inkey {{ server_key }} -name {{ server_name }} > server.p12
```

Next, use `keytool` to create a Java KeyStore (JKS) with the certificate and key for use by your Java code. You'll be prompted to create a new password for the resulting file as well as enter the password for the PKCS12 file from the previous step. Hang onto the new JKS password for use in configuration below.

```shell-session
$ keytool -importkeystore -srckeystore server.p12 -destkeystore java.server.keystore.jks -srcstoretype pkcs12 -alias {{ server_name }}
```

**Note:** It's safe to ignore the following warning from `keytool`.

```
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore server.p12 -destkeystore java.server.keystore.jks -srcstoretype pkcs12".
```

You'll also need a trust store in JKS format containing the root certificate from your CA. Your Java code will use this trust store to make sure certificates presented by servers were signed by your CA. Create the password and agree to trust your CA certificate (type "yes"). Hold onto the password for this one as well.

```shell-session
$ keytool -keystore java.server.truststore.jks -alias CARoot -import -file {{ ca_cert }}
```

Pass your JKS key & trust store into your custom `SSLContext` which you will subsequently use to bootstrap HTTPS clients to make request. All of the following Java code will depend on [org.apache.httpcomponents's httpcore](https://search.maven.org/artifact/org.apache.httpcomponents/httpcore/4.4.12/jar).


```java
// ...
KeyStore identityKeyStore = KeyStore.getInstance("jks");
FileInputStream identityKeyStoreFile = new FileInputStream(new File("java.server.keystore.jks"));
identityKeyStore.load(identityKeyStoreFile, "<keystore password>".toCharArray());

KeyStore trustKeyStore = KeyStore.getInstance("jks");
FileInputStream trustKeyStoreFile = new FileInputStream(new File("java.server.truststore.jks"));
trustKeyStore.load(trustKeyStoreFile, "<truststore password>".toCharArray());


SSLContext sslContext = SSLContexts.custom()
  // load identity keystore
  .loadKeyMaterial(identityKeyStore, "<keystore password>".toCharArray(), new PrivateKeyStrategy() {
    @Override
    public String chooseAlias(Map<String, PrivateKeyDetails> aliases, Socket socket) {
      return "{{ server_name }}";
    }
  })
  // load trust keystore
  .loadTrustMaterial(trustKeyStore, null)
  .build();
// ...
```

Now you will be able to bootstrap a HTTP(S) server secured by TLS server authentication. Clients requesting this server will be able to verify the server's identity.

```java
// ...
SocketConfig socketConfig = SocketConfig.custom()
  .setSoTimeout(15000)
  .setTcpNoDelay(true)
  .build();

final HttpServer server = ServerBootstrap.bootstrap()
  .setListenerPort(9443)
  .setSocketConfig(socketConfig)
  .setSslContext(sslContext)
  .setSslSetupHandler(socket -> socket.setNeedClientAuth(true))
  .registerHandler("*", new HttpRequestHandler()
  {
    @Override
    public void handle (HttpRequest request, HttpResponse response, HttpContext context)
            throws HttpException, IOException
    {
        response.setStatusCode(HttpStatus.SC_OK);
    }
  }).create();

server.start();
// ...
```
