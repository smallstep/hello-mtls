We'll demonstrate how to request services secured by TLS client authentication in Java.

Use `openssl` to package up the client private key and certificate into PKCS12 format. You'll be prompted to create a password here. Hold on to this, as you'll need it in the next step and in configuration later.

```shell-session
$ openssl pkcs12 -export -in {{ client_cert }} -inkey {{ client_key }} -name {{ client_name }} > client.p12
```

Next, use `keytool` to create a Java KeyStore (JKS) with the certificate and key for use by your Java code. You'll be prompted to create a new password for the resulting file as well as enter the password for the PKCS12 file from the previous step. Hang onto the new JKS password for use in configuration below.

```shell-session
$ keytool -importkeystore -srckeystore client.p12 -destkeystore java.client.keystore.jks -srcstoretype pkcs12 -alias {{ client_name }}
```

**Note:** It's safe to ignore the following warning from `keytool`.

```
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore client.p12 -destkeystore java.client.keystore.jks -srcstoretype pkcs12".
```

You'll also need a trust store in JKS format containing the root certificate from your CA. Your Java code will use this trust store to make sure certificates presented by servers were signed by your CA. Create the password and agree to trust your CA certificate (type "yes"). Hold onto the password for this one as well.

```shell-session
$ keytool -keystore java.client.truststore.jks -alias CARoot -import -file {{ ca_cert }}
```

Pass your JKS key and trust store into your custom `SSLContext` which you will subsequently use to bootstrap HTTPS clients to make request. All of the following Java code will depend on [org.apache.httpcomponents's httpclient](https://search.maven.org/artifact/org.apache.httpcomponents/httpclient/4.5.10/jar).

```java
// ...
KeyStore identityKeyStore = KeyStore.getInstance("jks");
FileInputStream identityKeyStoreFile = new FileInputStream(new File("java.client.keystore.jks"));
identityKeyStore.load(identityKeyStoreFile, "<keystore password>".toCharArray());

KeyStore trustKeyStore = KeyStore.getInstance("jks");
FileInputStream trustKeyStoreFile = new FileInputStream(new File("java.client.truststore.jks"));
trustKeyStore.load(trustKeyStoreFile, "<truststore password>".toCharArray());


SSLContext sslContext = SSLContexts.custom()
  // load identity keystore
  .loadKeyMaterial(identityKeyStore, "<keystore password>".toCharArray(), new PrivateKeyStrategy() {
    @Override
    public String chooseAlias(Map<String, PrivateKeyDetails> aliases, Socket socket) {
      return "{{ client_name }}";
    }
  })
  // load trust keystore
  .loadTrustMaterial(trustKeyStore, null)
  .build();
// ...
```

Now you will be able to issue arbitrary HTTP requests (e.g. GET) over TLS through client authentication to the server in your Java code:

```java
// ...
SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactory(sslContext,
  new String[]{"TLSv1.2", "TLSv1.1"},
  null,
  SSLConnectionSocketFactory.getDefaultHostnameVerifier());

CloseableHttpClient client = HttpClients.custom()
  .setSSLSocketFactory(sslConnectionSocketFactory)
  .build();

HttpGet _get = new HttpGet("https://server.internal.net:9443/");
HttpResponse response = client.execute(_get);
// ...
```
