-- Drops the tracker_db if it exists currently --
DROP DATABASE IF EXISTS tracker_db;
-- Creates the tracker_db database --
CREATE DATABASE tracker_db;

-- use tracker_db database --
USE tracker_db;

DROP TABLE IF EXISTS department;
-- Creates the table "department" within tracker_db --
CREATE TABLE department (
  -- Creates a numeric column called "id" --
  -- added AUTO_INCREMENT to fix ERROR 1364 and ERROR 1452; --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- Makes a string column called "name" which cannot contain null --
  name VARCHAR(30) NOT NULL
);


DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    -- added AUTO_INCREMENT to fix ERROR 1364 and ERROR 1452; --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    -- added AUTO_INCREMENT to fix ERROR 1364 and ERROR 1452; --
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT ,
  manager_id INT,
  FOREIGN KEY (role_id)
  REFERENCES roles(id)
  ON DELETE SET NULL,
  FOREIGN KEY (manager_id)
  REFERENCES employee(id)
  ON DELETE SET NULL
);



