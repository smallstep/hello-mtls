In your server's Go file, we pass the server's certificate and private key into Go's convenient API to launch a HTTPS listener.

```go
// ...

http.ListenAndServeTLS(":9443", "server.crt", "server.key", nil)

// ...
```
