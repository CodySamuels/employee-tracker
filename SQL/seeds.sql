USE employee_db;

INSERT INTO department (name)
VALUES
("Sales"),
("Development"),
("Research"),
("Entertainment");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Associate", 24000, 1),
("Sales Manager", 65000, 1),
("Junior Developer", 40000, 2),
("Engineer", 65000, 2),
("Engineering Manager", 120000, 2),
("Clown", 25000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("Jeremy", "Wade", 1, 1),
("Steve", "Buscemi", 2, null),
("Trish", "Ness", 3, 2),
("Joe", "Manateam", 4, null),
("Top", "Banana", 6, null);