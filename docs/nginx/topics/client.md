Configure your upstream location to use a certificate for TLS communication when it proxies traffic to the backend. We'll specify the TLS protocol and some preferred ciphers:

```nginx
location /upstream {
    proxy_pass                https://{{ server_name }};
    proxy_ssl_certificate     {{ client_cert }};
    proxy_ssl_certificate_key {{ client_key }};
    proxy_ssl_protocols       TLSv1.2 TLSv1.3;
    proxy_ssl_ciphers         HIGH:!aNULL:!MD5;
    # ...
}
```

Further, configure your Nginx proxy to verify the server using your CA root certificate along with a verification depth for the server's certificate chain:

```nginx
location /upstream {
    # ...
    proxy_ssl_trusted_certificate /etc/nginx/{{ ca_cert }};
    proxy_ssl_verify              on;
    proxy_ssl_verify_depth        2;
    # ...
}
```
