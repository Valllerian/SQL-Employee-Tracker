INSERT INTO department (name)
VALUES ("Marketing"),
("Operations"),
("Finance"),
("Sales"),
("HR"),
("Purchase");

INSERT INTO roles (id,title,salary,department_id)
VALUES (001, "CEO","650000",2),
(002, "Finance Director","350000",3),
(003, "Program Director","350000",4),
(004, "Operation Director","350000",2),
(005, "Human Recources","250000",5),
(006, "Marketing Director","350000",1), 
(007, "Supply Director","350000",6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Viktor", "Of Zaun", 1, NULL),
("Luxanna", "Crownguard", 2, 1), 
("Garen", "Crownguard", 3, 1),
("Fiora", "Laurent", 4, 1), 
("Sylas", "of Dregbourne", 5, 4), 
("Jarvan", "Lightshield", 5, 4), 
("Shauna", "Vayne", 6, 4),
("Irelia", "Xan", 7, 4);