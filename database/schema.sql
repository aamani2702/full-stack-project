-- Module 9: MySQL schema for Bloom & Co.
-- (The running app uses MongoDB; this is the equivalent relational design.)
CREATE DATABASE IF NOT EXISTS bloom;
USE bloom;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash CHAR(60) NOT NULL,            -- bcrypt hash
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK (price >= 0),
  category ENUM('Indoor','Succulent','Flowering','Herb','Accessory') NOT NULL,
  image VARCHAR(255),
  stock INT NOT NULL DEFAULT 10,
  rating DECIMAL(2,1) DEFAULT 4.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  body TEXT NOT NULL,
  author_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Bloom Admin',   'admin@bloom.com', '$2a$12$exampleexampleexampleexampleexampleexampleexampleexamp', 'admin'),
  ('Demo Gardener', 'demo@bloom.com',  '$2a$12$exampleexampleexampleexampleexampleexampleexampleexamp', 'user');

INSERT INTO products (name, description, price, category, stock, rating) VALUES
  ('Monstera Deliciosa', 'Iconic split-leaf plant.', 34.00, 'Indoor', 12, 4.9),
  ('Snake Plant', 'Nearly indestructible.', 22.00, 'Indoor', 20, 4.8),
  ('Aloe Vera', 'Soothing and easy.', 15.00, 'Succulent', 18, 4.8),
  ('Phalaenopsis Orchid', 'Long-lasting blooms.', 42.00, 'Flowering', 7, 4.7),
  ('Sweet Basil', 'Kitchen windowsill herb.', 8.00, 'Herb', 30, 4.5);

INSERT INTO posts (title, body, author_id) VALUES
  ('5 Plants That Survive Almost Anything', 'Start with a snake plant, pothos, jade...', 1),
  ('How I Finally Stopped Overwatering', 'The finger test changed everything...', 2);
