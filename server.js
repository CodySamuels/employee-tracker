// DEPENDENCIES
var mysql = require("mysql");
const inquirer = require("inquirer");

// CONNECTS TO THE DATABASE
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_db"
});

// SHOWS THE CONNECTION ID AND STARTS THE PROGRAM
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

// CUSTOM CODE BELOW
// =======================================================

// BEAUTIFUL, FINISHED
const start = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to do?",
    choices: ["ADD", "EDIT", "VIEW", "EXIT"]
  })
  switch (userInput) {
    case "ADD":
      addInquirer()
      break;
    case "EDIT":
      editInquirer()
      break;
    case "VIEW":
      viewInquirer()
      break;
    default:
      console.log("Thank you, goodbye!")
      connection.end();
      break;
  }
}

// IN PROGRESS. NEEDS WORK ON ADDING MANAGER FUNCTIONALITY
const addInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to add?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "GO BACK"]
  })

  switch (userInput) {
    case "DEPARTMENT":
      const { departmentName } = await inquirer.prompt({
        type: "input",
        message: "What would you like to name the new department?",
        name: "departmentName"
      })
      const query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: departmentName
        },
        function (err, res) {
          if (err) throw err;
          console.log("====================================================================")
          console.log(`The ${departmentName} department added!\n`);
          start();
        }
      );
      break;

    case "ROLE":
      connection.query("SELECT * FROM department", async (err, res) => {
        if (err) throw err
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "Which department would you like to add the new role to?",
            name: "department_id",
            choices: res.map(item => item.name),
          },
          {
            type: "input",
            message: "What is the title of the new role?",
            name: "role_title"
          },
          {
            type: "input",
            message: "What is this role's salary? Please input a number",
            name: "role_salary",
            validate: (value) => (!isNaN(value) ? true : false),
          },
        ]);

        const chosenItem = res.filter(res => res.name === answers.department_id);
        const query = connection.query(
          "INSERT INTO role SET ?",
          {
            title: answers.role_title,
            salary: answers.role_salary,
            department_id: chosenItem[0].id,
          },
          (err, res) => {
            if (err) throw err;
            console.log("====================================================================")
            console.log(`The ${answers.role_title} role has been added!\n`);
            start();
          }
        );
      })
      break;

    // STILL COULD USE TWEAKING
    case "EMPLOYEE":
      connection.query("SELECT * FROM role", async (err, res) => {
        if (err) throw err
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "Which role would you like to add the new employee to?",
            name: "role_id",
            choices: res.map(item => item.title),
          },
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "first_name",
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "last_name",
          },
          {
            // BASIC BUT WORKS
            type: "input",
            message: "Does this employee have a manager? If so, who? Please use manager ID",
            name: "manager_id",

            // WIP CODE.
            // type: "list",
            // message: "Does this employee have a manager? If so, who? Please use manager ID",
            // name: "manager_id",
            // choices: res.map(item => item.first_name)
          },
        ]);

        const chosenItem = res.filter(res => res.title === answers.role_id);
        const query = connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: chosenItem[0].id,
            manager_id: answers.manager_id,
          },
          (err, res) => {
            if (err) throw err;
            console.log("====================================================================")
            console.log(`${answers.first_name} ${answers.last_name} has been added!\n`);
            start();
          }
        );
      })
      break;

    default:
      start();
      break;
  }
}

// NEEDS WORK ADDING EMPLOYEE EDITING
const editInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to edit?",
    choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "GO BACK"]
  })

  switch (userInput) {

    // COMPLETED
    case "DEPARTMENTS":
      connection.query("SELECT * FROM department", async (err, res) => {
        if (err) throw err
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "Which department would you like to edit the name of?",
            name: "id",
            choices: res.map(item => item.name),
          },
          {
            type: "input",
            message: "What would you like to change the name to?",
            name: "name"
          }
        ])
        const chosenItem = res.filter(res => res.name === answers.id);
        const query = connection.query(
          "UPDATE department SET ? WHERE ?",
          [
            {
              name: answers.name
            },
            {
              id: chosenItem[0].id
            }
          ],
          function (err, res) {
            if (err) throw err;
            console.log("====================================================================")
            start();
          }
        );
      })
      break;

    // COULD EVENTUALLY ADD CHANGE DEPARTMENT?
    case "ROLES":
      connection.query("SELECT * FROM role", async (err, res) => {
        if (err) throw err
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "Which role would you like to edit?",
            name: "id",
            choices: res.map(item => item.title),
          },
          {
            type: "list",
            message: "What do you want to change?",
            name: "selection",
            choices: ["TITLE", "SALARY"]
          }
        ])
        const chosenItem = res.filter(res => res.title === answers.id);
        switch (answers.selection) {
          // BEAUTIFUL
          case "TITLE":
            const titleAnswer = await inquirer.prompt([
              {
                type: "input",
                message: "What would you like to change the name to?",
                name: "title"
              }
            ])
            const query = connection.query(
              "UPDATE role SET ? WHERE ?",
              [
                {
                  title: titleAnswer.title
                },
                {
                  id: chosenItem[0].id
                }
              ],
              function (err, res) {
                if (err) throw err;
                console.log("====================================================================")
                start();
              }
            );
            break;

          // BEAUTIFUL
          case "SALARY":
            const salaryAnswer = await inquirer.prompt([
              {
                type: "input",
                message: "What would you like to change the salary to?",
                name: "salary"
              }
            ])
            const query2 = connection.query(
              "UPDATE role SET ? WHERE ?",
              [
                {
                  salary: salaryAnswer.salary
                },
                {
                  id: chosenItem[0].id
                }
              ],
              function (err, res) {
                if (err) throw err;
                console.log("====================================================================")
                start();
              }
            );
            break;

          default:
            start();
            break;
        }
      })
      break;

    // SEEMS TO BE WORKING WELL. COULD EVENTUALLY CHANGE MANAGER
    case "EMPLOYEES":
      connection.query("SELECT *, first_name, last_name, id, role_id, manager_id, CONCAT(employee.first_name, ' ' ,employee.last_name) AS name FROM employee", async (err, res) => {
        if (err) throw err
        const answers = await inquirer.prompt([
          {
            type: "list",
            message: "Which employee would you like to edit?",
            name: "id",
            choices: res.map(item => item.name),
          },
          {
            type: "list",
            message: "What do you want to change?",
            name: "selection",
            choices: ["FIRST NAME", "LAST NAME", "ROLE",]
          }
        ])
        const chosenItem = res.filter(res => res.name === answers.id);
        switch (answers.selection) {

          // BEAUTIFUL
          case "FIRST NAME":
            const firstAnswer = await inquirer.prompt([
              {
                type: "input",
                message: "What would you like to change the first name to?",
                name: "firstName"
              }
            ])
            const query = connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  first_name: firstAnswer.firstName
                },
                {
                  id: chosenItem[0].id
                }
              ],
              function (err, res) {
                if (err) throw err;
                console.log("====================================================================")
                start();
              }
            );
            break;

          // BEAUTIFUL
          case "LAST NAME":
            const lastAnswer = await inquirer.prompt([
              {
                type: "input",
                message: "What would you like to change the last name to?",
                name: "lastName"
              }
            ])
            const query2 = connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  last_name: lastAnswer.lastName
                },
                {
                  id: chosenItem[0].id
                }
              ],
              function (err, res) {
                if (err) throw err;
                console.log("====================================================================")
                start();
              }
            );
            break;

          // BEAUTIFUL
          case "ROLE":
            connection.query("SELECT * FROM role", async (err, res) => {
              const roleAnswer = await inquirer.prompt([
                {
                  type: "list",
                  message: "What would you like to change the role to?",
                  choices: res.map(item => item.title),
                  name: "role",
                }
              ])
              const chosenItem2 = res.filter(res => res.title === roleAnswer.role);
              const query3 = connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    role_id: chosenItem2[0].id
                  },
                  {
                    id: chosenItem[0].id
                  }
                ],
                function (err, res) {
                  if (err) throw err;
                  console.log("====================================================================")
                  start();
                }
              );
            });
            break;
          default:
            start();
            break;
        }
      })
      break;
    default:
      start();
      break;
  }
}

// BEAUTIFUL, FINISHED
const viewInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to view?",
    choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "GO BACK"]
  })
  switch (userInput) {
    case "DEPARTMENTS":
      connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
      });
      break;
    case "ROLES":
      connection.query("SELECT role.title, role.salary, department.name FROM role INNER JOIN DEPARTMENT ON role.department_id = department.id ORDER BY department.name;", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
      });
      break;
    case "EMPLOYEES":
      connection.query("SELECT CONCAT(employee.first_name, ' ' ,employee.last_name) AS Employee, role.title, role.salary, department.name, CONCAT(manager.first_name,' ', manager.last_name) AS Manager FROM employee LEFT JOIN employee AS Manager ON employee.manager_id = manager.id LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY department.name;", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
      });
      break;
    default:
      start();
      break;
  }
}

// NO WORK DONE. MOST UNDER CONSTRUCTION
const deleteInquirer = async () => { }