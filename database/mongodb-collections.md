# MongoDB collections (Module 9) - what the app actually uses

Mongoose models live in `server/src/models/`.

## users
```json
{ "_id": "ObjectId", "name": "Demo Gardener", "email": "demo@bloom.com",
  "password": "$2a$12$...bcrypt hash...", "role": "user", "createdAt": "ISODate", "updatedAt": "ISODate" }
```
`email` has a unique index. `password` is `select: false` so it never leaves the database by accident.

## products
```json
{ "_id": "ObjectId", "name": "Monstera Deliciosa", "description": "...", "price": 34,
  "category": "Indoor", "image": "https://...", "stock": 12, "rating": 4.9 }
```

## posts
```json
{ "_id": "ObjectId", "title": "...", "body": "...", "author": "ObjectId -> users._id" }
```
`author` is a reference; the API uses `populate('author', 'name')` - the MongoDB equivalent of a SQL JOIN.

## Sample mongosh queries
```js
db.products.find({ category: "Indoor" }).sort({ price: -1 })
db.products.aggregate([{ $group: { _id: "$category", avgPrice: { $avg: "$price" }, n: { $sum: 1 } } }])
db.posts.aggregate([{ $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } }])
db.products.updateOne({ name: "Aloe Vera" }, { $set: { price: 16 } })
db.products.deleteOne({ name: "Test" })
```
