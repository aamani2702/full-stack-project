-- Module 9: basic CRUD + JOIN queries (run after schema.sql)

-- CREATE
INSERT INTO products (name, description, price, category) VALUES ('Rosemary', 'Aromatic herb.', 10.00, 'Herb');

-- READ
SELECT * FROM products WHERE category = 'Indoor' ORDER BY price DESC;
SELECT category, COUNT(*) AS items, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category;

-- UPDATE
UPDATE products SET price = 36.00, stock = stock - 1 WHERE name = 'Monstera Deliciosa';

-- DELETE
DELETE FROM products WHERE name = 'Rosemary';

-- JOIN: posts with their author names
SELECT p.id, p.title, u.name AS author, p.created_at
FROM posts p
INNER JOIN users u ON u.id = p.author_id
ORDER BY p.created_at DESC;

-- JOIN + aggregate: posts per user (including users with none)
SELECT u.name, COUNT(p.id) AS total_posts
FROM users u
LEFT JOIN posts p ON p.author_id = u.id
GROUP BY u.id, u.name;
