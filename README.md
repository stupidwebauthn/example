# Stupid Webauthn Example

- Email is used for verification
- Passkeys are used for authentication
- Sqlite is used for database
- Api calls and shared JWT secrets are used for internal connections
- JWT is used for session security


## Example Installation

Git clone

```sh
git clone --depth 1 https://github.com/stupidwebauthn/example stupidwebauthnexample
cd stupidwebauthnexample
```

Run

```sh
docker compose up -d
```

Open http://localhost:5178/

> [!NOTE]
> Opening on http://127.0.0.1:5178/ is not supported, it must be on the correct domain

## License

MIT License
