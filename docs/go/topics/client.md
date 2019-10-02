In your Go code, we specify a TLS stack configuration for your client(s) making requests. The configuration includes 1.) root certificates of all trusted CAs for verification of the server's certificate in a pool we create. And 2.) the client's own certificate and private key for server-side client certificate verification.
```go
// ...

caCert, _ := ioutil.ReadFile("{{ ca_cert }}")
caCertPool := x509.NewCertPool()
caCertPool.AppendCertsFromPEM(caCert)

cert, _ := tls.LoadX509KeyPair("{{ client_cert }}", "{{ client_key }}")

client := &http.Client{
    Transport: &http.Transport{
        TLSClientConfig: &tls.Config{
            RootCAs: caCertPool,
            certificates: []tls.Certificate{cert},
        },
    },
}

// Make a request
r, err := client.Get("https://{{ server_name }}:{{ server_port }}")

// ...
```
