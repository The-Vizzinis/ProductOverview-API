-- CREATE TABLE products (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255),
--   slogan TEXT,
--   description TEXT,
--   category VARCHAR(50),
--   default_price VARCHAR(50)
-- );

-- COPY products 
-- FROM '/Users/erichernandez/Desktop/products/product.csv'
-- CSV HEADER;


-- CREATE TABLE features (
--   id SERIAL PRIMARY KEY,
--   product_id INTEGER,
--   feature VARCHAR(255),
--   value VARCHAR(255),
--   FOREIGN KEY (product_id) REFERENCES products(id)
-- );

-- COPY features 
-- FROM '/users/erichernandez/desktop/products/features.csv'
-- CSV;

-- CREATE TABLE related_products (
--   id SERIAL PRIMARY KEY,
--   current_product_id INTEGER,
--   related_product_id INTEGER
-- );

-- COPY related_products
-- FROM '/Users/erichernandez/Desktop/products/related.csv'
-- CSV HEADER;

-- CREATE TABLE styles (
--   style_id SERIAL PRIMARY KEY,
--   product_id INTEGER,
--   name VARCHAR(255),
--   sale_price VARCHAR(50),
--   original_price VARCHAR(50),
--   default_style BOOLEAN
-- );

-- COPY styles
-- FROM '/Users/erichernandez/Desktop/products/styles.csv'
-- CSV HEADER;

-- CREATE INDEX style_name_asc ON styles(style_name ASC);

-- CREATE TABLE skus (
--   id SERIAL PRIMARY KEY,
--   style_id INTEGER,
--   size VARCHAR(50),
--   quantity INTEGER
-- );

-- COPY skus
-- FROM '/Users/erichernandez/Desktop/products/skus.csv'
-- CSV HEADER;

-- CREATE TABLE photos (
--   id SERIAL PRIMARY KEY,
--   style_id INTEGER,
--   url TEXT,
--   thumbnail_url TEXT
-- );

-- COPY photos
-- FROM '/Users/erichernandez/Desktop/products/photos.csv'
-- CSV HEADER;








-- CREATE TEMPORARY TABLE tmp_table 
--   AS 
--   SELECT *
--   FROM styles
--   WITH NO DATA;

--   COPY tmp_table
--   FROM '/Users/erichernandez/Desktop/products/styles.csv' CSV HEADER;

--   INSERT INTO styles
--   SELECT *
--   FROM tmp_table
--   ON CONFLICT DO NOTHING;

--   DROP TABLE tmp_table;

-- template for deleting duplicate entries based off all rows excluding the id
-- deleted 131003 entries from styles table
-- DELETE FROM styles 
-- WHERE id 
-- IN (SELECT id
-- FROM (SELECT id,
-- ROW_NUMBER() OVER (PARTITION BY productid, style_name, sale_price, original_price, default_style 
-- ORDER BY id ) AS row_num
-- FROM styles ) t 
-- WHERE t.row_num > 1);

-- -- deleted 0 entries from products
-- DELETE FROM products
-- WHERE id 
-- IN (SELECT id
-- FROM (SELECT id,
-- ROW_NUMBER() OVER (PARTITION BY name, slogan, description, category, default_price 
-- ORDER BY id ) AS row_num
-- FROM products ) t 
-- WHERE t.row_num > 1);

-- -- deleted 86651 entries from features
-- DELETE FROM features
-- WHERE id 
-- IN (SELECT id
-- FROM (SELECT id,
-- ROW_NUMBER() OVER (PARTITION BY product_id, feature, feature_value 
-- ORDER BY id ) AS row_num
-- FROM features ) t 
-- WHERE t.row_num > 1);