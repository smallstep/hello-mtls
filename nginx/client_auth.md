In your server's configuration block, specify the location of your CA root certificate to use for authenticating client certificates. If you intend to authenticate web browsers with UI, you may choose to make client verification optional so your application can present unauthorized users with a 403 message:


```nginx
server {
    listen              443 ssl;
    server_name         ${identity_name};
    ...
    ssl_client_certificate /etc/nginx/client_certs/${ca_cert};
    ssl_verify_client optional;

    ...


    location / {
      if ($ssl_client_verify != SUCCESS) {
        return 403;
      }
    ...
}
```
