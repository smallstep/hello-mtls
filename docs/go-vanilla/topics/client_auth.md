In your server's Go file, we pass a TLS stack configuration into the server initalization. The configuration enables strict client certificate verficiation against all trusted root certificates in the CA pool we create. Finally, we call the server's API to create a HTTPS listener using it's own certificate and private key for client-side verification.

```go
// ...

caCert, _ := ioutil.ReadFile("root.crt")
caCertPool := x509.NewCertPool()
caCertPool.AppendCertsFromPEM(caCert)

tlsConfig := &tls.Config{
    ClientCAs: caCertPool,
    ClientAuth: tls.RequireAndVerifyClientCert,
}
tlsConfig.BuildNameToCertificate()

server := &http.Server{
    Addr:      ":9443",
    TLSConfig: tlsConfig,
}

server.ListenAndServeTLS("server.crt", "server.key")

// ...
```
