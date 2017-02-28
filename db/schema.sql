-- this is to outline my schema
CREATE TABLE orders
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE pizzas
(
  id INT,
  name VARCHAR(100),
  orderid int REFERENCES orders(id)
);




INSERT INTO orders (name)  VALUES ('big order');
INSERT INTO orders (name)  VALUES ('pizzas for one');
INSERT INTO orders (name)  VALUES ('party platter');
