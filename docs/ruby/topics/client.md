Pass your certificate, private key, and root CA certificate to `Net::HTTP` to authenticate your request over TLS.

For additional security, step certificates are signed by an intermediate CA rather than the root CA. The intermediate certificate is bundled into your `{{ client_cert }}` file. Ruby does not offer any mechanism to automatically load bundled certificates, so we will need to parse the individual certificates out of `{{ client_cert }}` ourselves.

Further, `Net::HTTP` has an [outstanding bug](https://bugs.ruby-lang.org/issues/9758) that excludes the `extra_chain_cert` parameter, which needs to be passed to OpenSSL to handle our intermediate CA certificate. We'll patch `Net::HTTP` to make that attribute available.

```ruby
require 'openssl'
require 'net/http'

# patch Net::HTTP to support extra_chain_cert
class Net::HTTP
  SSL_IVNAMES << :@extra_chain_cert unless SSL_IVNAMES.include?(:@extra_chain_cert)
  SSL_ATTRIBUTES << :extra_chain_cert unless SSL_ATTRIBUTES.include?(:extra_chain_cert)

  attr_accessor :extra_chain_cert
end

# ...

# parse the client certificate and intermediate CA certificate from {{ client_cert }}
bundle = File.read('{{ client_cert }}')
bundle_certs = bundle.scan(/-----BEGIN CERTIFICATE-----(?:.|\n)+?-----END CERTIFICATE-----/)
client_cert = OpenSSL::X509::Certificate.new(bundle_certs[0])
intermediate_cert = OpenSSL::X509::Certificate.new(bundle_certs[1])

options = {
  use_ssl: true,
  verify_mode: OpenSSL::SSL::VERIFY_PEER,
  cert: client_cert,
  extra_chain_cert: [intermediate_cert],
  key: OpenSSL::PKey::EC.new(File.read('{{ client_key }}')),
  ca_file: '{{ ca_cert }}'
}

http = Net::HTTP.start('{{ server_name }}', {{ server_port }}, options)

response = http.request Net::HTTP::Get.new '/'
# do something with response...

# ...
```
