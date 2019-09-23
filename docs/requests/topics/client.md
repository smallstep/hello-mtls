Pass your certificate, private key, and root CA certificate to `requests.get()` (or its respective request method) to authenticate your request over TLS.

```python
result = requests.get(
    'https://{{ server_name }}:{{ server_port }}',
    cert=('{{ client_cert }}', '{{ client_key }}'),
    verify='{{ ca_cert }}')

# do something with result...
```
