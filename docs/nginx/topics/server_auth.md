In your Nginx configuration's server block, enable `ssl` for the listening socket and specify the locations of the server's certificate and private key. We'll also tell Nginx to use TLS protocols and our preferred ciphers:

```nginx
server {
    listen              443 ssl;
    server_name         {{ server_name }};
    ssl_certificate     {{ server_cert }};
    ssl_certificate_key {{ server_key }};
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    # ...
}
```
