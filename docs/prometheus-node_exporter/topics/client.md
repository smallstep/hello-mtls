If you want to connect to a `node_exporter` instance independently, and you have client HTTPS authentication configured, you'll need to present a client certificate signed by your CA.

## With curl

Pass your certificate, private key, and root CA certificate to `curl` to authenticate your request over TLS.

```shell-session
$ curl --cert {{ client_cert }} --key {{ client_key }} --cacert {{ ca_cert }} https://node-exporter-node:9100/metrics
```

## With Firefox

Firefox requires that you import a PKCS#12 (`.p12`) certificate bundle. So, you'll need to create that file using your client certificate and key.

```shell-session
$ openssl pkcs12 -export -in {{ client_cert }} -inkey {{ client_key }} -name myuser > firefox.p12
```

You'll have to enter a dummy password to encrypt the file (which you'll decrypt immediately when you import it into Firefox).

Go to Firefox's [Privacy & Security Preferences](about:preferences#privacy) and choose View Certificates... under Certificates. In the "Your Certificates" tab you can import your `.p12` file.
