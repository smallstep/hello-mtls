# Hello mTLS

This package contains documentation on how to configure a broad array of technologies to perform mutual TLS. It is part of the Hello mTLS project, designed to raise developer awareness about public key infrastructure as a potential solution to common security problems.

If you notice any outdated, missing, or errant docs, pull requests are strongly encouraged!

## Contributing

Documentation for each technology lives in its corresponding directory in the [docs/](docs/) folder.

To get rolling on local development, clone this repository and start the local dev server:

```
$ yarn install
$ yarn start
```

You will be able to preview all changes at http://localhost:3000.


### Adding new technologies

If you are adding a new technology, your best bet is to refer to existing configurations in this repository, but here is a high-level breakdown of each directory's contents.

#### config.yaml

This file configures basic information like the technology name and external links to documentation.

#### logo.png

This is a 256 x 256px transparent PNG of the technology's logo. If missing, a standard placeholder will be used.

#### topics/

Several optional markdown files provide prose describing how to perform different aspects of mTLS using the technology:

- `server_auth.md` &mdash; Server TLS authentication 
- `client_auth.md` &mdash; Client TLS authentication
- `client.md` &mdash; Client requests using TLS
- `renewal.md` &mdash; TLS cetificate renewal

Properties with corresponding names in the `topics` object in `config.yaml` also accept a `links` array for any relevant external resources.

If your documentation makes use of the name of a certificate's identity, its certificate filename, its private key filename, or the root certificate filename, please use these template tokens. They will be interpolated with the appropriate values at build time in different contexts:

- `{{ server_name }}` &mdash; Name of the identity like `example.internal.net`
- `{{ server_cert }}` &mdash; Filename of the server's certificate like `example.crt`
- `{{ server_key }}` &mdash; Filename of the server's private key like `example.key`
- `{{ client_name }}` &mdash; Name of the identity like `example.internal.net`
- `{{ client_cert }}` &mdash; Filename of the client's certificate like `example.crt`
- `{{ client_key }}` &mdash; Filename of the client's private key like `example.key`
- `{{ ca_cert }}` &mdash; Filename of the root CA certificate like `ca.crt`

Do not use markdown headlines.

### Testing changes

Run `yarn test` locally to test that your changes are valid before opening a pull request.

## License

Code in this repository is licensed under [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

All [documentation content](docs/) is licensed under [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>

## Support

Please don't hesitate to reach out on [our Gitter](https://gitter.im/smallstep/community) with any questions.
