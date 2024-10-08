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
docker compose up --build
```

Open http://localhost:5178/ and the test mail server http://localhost:8025/

> [!NOTE]
> Opening on http://127.0.0.1:5178/ is not supported, it must be on the correct domain

1. Click on **Register**, then fill in an email and an email will appear in <http://localhost:8025/>, click the link in the mail, then follow the passkey instructions and you should be logged-in.
2. (If logged-in: log-out) Click on **Login** and fill in the email you used to register with, then follow the passkey instructions and you should be logged-in.

## License

MIT License
