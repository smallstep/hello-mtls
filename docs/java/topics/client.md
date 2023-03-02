This example assumes only Java 11 or newer and does not require any libraries.

There are multiple ways to convert certificate, private key and root CA certificate to a format that java can digest.
Java works with "key stores" which can be in the (java proprietary) `JKS` or `PKCS #12` format (among others),
and can also be created at runtime. But here we will use only `step` and a minimal amount of code.

Trust store and key store can also be configured on a JVM level, but on the client we probably want to configure
them on a per-connection basis, so this is what we will do here.

Make sure to set a password for trust and key store in the next steps:

1. Package the root CA certificate: `step certificate p12 truststore.p12 --ca {{ ca_cert }}`
2. Package certificate and key: `step certificate p12 keystore.p12 {{ client_cert }} {{ client_key }} --ca {{ ca_cert }}`

You can now put these files on your classpath or read them from the file system: 

```java
// imports omitted

public class HelloMtlsClient {
    public static void main(String[] args) throws Exception {
        var keyStore = KeyStore.getInstance("PKCS12");
        var trustStore = KeyStore.getInstance("PKCS12");
        var keyStorePassword = "changeit";
        var trustStorePassword = "changeit";
    
        try (var keystoreFile = Files.newInputStream(Path.of("keystore.p12"));
             var truststoreFile = Files.newInputStream(Path.of("truststore.p12"))) {
            keyStore.load(keystoreFile, keyStorePassword.toCharArray());
            trustStore.load(truststoreFile, trustStorePassword.toCharArray());
        }
    
        var keyManager = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
        keyManager.init(keyStore, keyStorePassword.toCharArray());
    
        var trustManager = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        trustManager.init(trustStore);
    
        var sslContext = SSLContext.getInstance("TLSv1.3");
        sslContext.init(keyManager.getKeyManagers(), trustManager.getTrustManagers(), null);
    
        SSLParameters sslParameters = new SSLParameters();
        sslParameters.setNeedClientAuth(true);
    
        var httpClient = HttpClient.newBuilder()
                .sslContext(sslContext)
                .sslParameters(sslParameters)
                .build();
    
        var request = HttpRequest.newBuilder(URI.create("https://{{ server_name }}:{{ server_port }}")).GET().build();
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    
        // Do something with the response
    }
}
```
