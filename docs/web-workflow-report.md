# Module 1 - Short Report on Web Workflow

## Client-server architecture
A **client** (the browser) sends an HTTP request; a **server** processes it and returns a response. In this project:

```
Browser (React app)  --HTTP/JSON-->  Express API (Node.js)  --Mongoose-->  MongoDB
        ^                                   |
        +-------------- JSON response ------+
```

1. The user clicks "Shop" in the React app.
2. React calls `GET /api/products` with `fetch`.
3. Express routes the request to `routes/products.js`, which asks MongoDB (via Mongoose) for documents.
4. MongoDB returns the data, Express sends it as JSON, React renders cards.

## Static vs dynamic websites
| | Static | Dynamic |
|---|---|---|
| Content | Fixed HTML files | Built per request from data |
| Backend / DB | None | Required |
| Example here | `static-site/` | `client/` + `server/` |
| Pros | Fast, cheap, simple | Personalised, interactive, editable data |

## Types of websites in this project
- **Static** brochure site (Modules 1-5)
- **Bootstrap** responsive site (Module 6)
- **Dynamic single-page application** with auth and database (Modules 7-12)
