Pass your certificate, private key, and root CA certificate to `Net::HTTP` to authenticate your request over TLS.

```ruby
require 'openssl'
require 'net/http'

# ...

options = {
  use_ssl: true,
  verify_mode: OpenSSL::SSL::VERIFY_PEER,
  cert: OpenSSL::X509::Certificate.new(File.read('{{ client_cert }}')),
  key: OpenSSL::PKey::EC.new(File.read('{{ client_key }}')),
  ca_file: '{{ ca_cert }}'
}

http = Net::HTTP.start('{{ server_name }}', {{ server_port }}, options)

response = http.request Net::HTTP::Get.new '/'
# do something with response...

# ...
```
