Pass your certificate, private key, and root CA certificate to the PHP cURL methods to authenticate your request over TLS.

```php
<?php
// ...

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://{{ server_name }}:{{ server_port }});
curl_setopt($ch, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
curl_setopt($ch, CURLOPT_SSLCERT, "{{ client_cert }}");
curl_setopt($ch, CURLOPT_SSLKEY, "{{ client_key }}");
curl_setopt($ch, CURLOPT_CAINFO, "{{ ca_cert }}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
// do something with the result...

// ...
?>
```
