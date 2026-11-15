# Module 11 - Authentication flow

```mermaid
sequenceDiagram
    participant U as User (React)
    participant A as Express API
    participant D as MongoDB
    U->>A: POST /api/auth/register {name, email, password}
    A->>A: validate input, bcrypt.hash(password, 12)
    A->>D: insert user (hash only)
    A-->>U: 201 {token (JWT), user}
    U->>U: store token in localStorage
    U->>A: POST /api/auth/login {email, password}
    A->>D: find user by email
    A->>A: bcrypt.compare(password, hash)
    A-->>U: 200 {token, user}
    U->>A: POST /api/posts  (Authorization: Bearer token)
    A->>A: protect middleware: jwt.verify -> req.user
    A->>D: insert post with author = req.user
    A-->>U: 201 post
```

**Security measures:** bcrypt (cost 12) password hashing, JWT with expiry, `protect` and `adminOnly` middleware, ownership checks on posts, helmet headers, CORS allow-list, rate limiting on `/api/auth`, `password` field excluded from queries by default.
