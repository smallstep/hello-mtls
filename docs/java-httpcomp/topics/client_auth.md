To enable client authentication in the TLS handshake we only need to slightly modify the server authentication example. The instruction `socket.setNeedClientAuth(true)` will require the clients to present a valid certificate when connections are being accepted. The certificate validation will be based on the root CA certificates included in the `java.server.truststore.jks` file.

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
  .setSslSetupHandler(socket -> socket.setNeedClientAuth(true)) // require client authentication
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
