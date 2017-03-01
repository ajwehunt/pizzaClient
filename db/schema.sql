-- this is to outline my schema
CREATE TABLE orders
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE pizzas
(
  name VARCHAR(100),
  orderid int REFERENCES orders(id)
);




INSERT INTO orders (name)  VALUES ('big order');
INSERT INTO orders (name)  VALUES ('pizzas for two');
INSERT INTO orders (name)  VALUES ('party platter');
--
--
--
-- # db/migrate/[timestamp]_create_todos.rb
-- class CreateTodos < ActiveRecord::Migration[5.0]
--   def change
--     create_table :todos do |t|
--       t.string :title
--       t.string :created_by
--
--       t.timestamps
--     end
--   end
-- end
--
--
-- class CreateItems < ActiveRecord::Migration[5.0]
--   def change
--     create_table :items do |t|
--       t.string :name
--       t.boolean :done
--       t.references :todo, foreign_key: true
--
--       t.timestamps
--     end
--   end
-- end
--
