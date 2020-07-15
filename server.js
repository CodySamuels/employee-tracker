var mysql = require("mysql");
const inquirer = require("inquirer");

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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

// 
// =======================================================

// function deleteEntry() {
//   console.log("Deleting all Queen entries...\n");
//   connection.query(
//     "DELETE FROM songs WHERE ?",
//     {
//       artist: "Queen"
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " entry deleted!\n");
//       // Call readsongs AFTER the DELETE completes
//       // readProducts();
//     }
//   );
// }

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

const addInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to add?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "GO BACK"]
  })
  switch (userInput) {
    case "DEPARTMENT":
      addDepartment()
      break;
    case "ROLE":
      addRole()
      break;
    case "EMPLOYEE":
      addEmployee()
      break;
    default:
      start();
      // connection.end();
      break;
  }
}

// NEEDS A LOT OF WORK TO UPDATE
const addEmployee = async () => {
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
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
      type: "input",
      message: "What role does this employee fill? Please use role ID",
      name: "role_id",
    }, {
      type: "input",
      message: "Does this employee have a manager? If so, who? Please use manager ID",
      name: "manager_id",
    },
  ])
  const query = connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: first_name,
      last_name: last_name,
      role_id: role_id,
      manager_id: manager_id,
    },
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      console.log(`The ${first_name} ${last_name} has been added!\n`);
      start();
    }
  );
}

const addRole = () => {
  connection.query("SELECT * FROM department", async (err, res) => {
    if (err) throw err
    const departments = res.map(function (department) {
        return ({
            name: department.name,
            value: department.id
        })
    })

    const { role_title, role_salary, department_id } = await inquirer.prompt([
      {
        type: "input",
        message: "What would you like to name the new role?",
        name: "role_title"
      },
      {
        type: "input",
        message: "What is this role's salary?",
        name: "role_salary",
        validate: (value) => (!isNaN(value) ? true : false),
      },
      {
        type: "list",
        message: "Which department would you like to add it to?",
        name: "role_department",
        choices: departments
      },
    ])
    const query = connection.query(
      "INSERT INTO role SET ?",
      {
        title: role_title,
        salary: role_salary,
        department_id: departments.value,
      },
      function (err, res) {
        if (err) throw err;
        console.log("====================================================================")
        console.log(`The ${role_title} role has been added!\n`);
        start();
      }
    );
  })
}
const addDepartment = async () => {
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
}

const editInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to edit?",
    choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "GO BACK"]
  })
  switch (userInput) {
    case "DEPARTMENTS":
      updateDepartment()
      break;
    case "ROLES":
      updateRole()
      break;
    case "EMPLOYEES":
      updateEmployee()
      break;
    default:
      start();
      break;
  }
}

const updateDepartment = async () => {
  const { id, name } = await inquirer.prompt([
    {
      type: "input",
      message: "Which department would you like to edit? Please use ID#",
      name: "id"
    },
    {
      type: "input",
      message: "What would you like to change the name to?",
      name: "name"
    }
  ])
  const query = connection.query(
    "UPDATE department SET ? WHERE ?",
    [
      {
        name: name
      },
      {
        id: id
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      start();
    }
  );
}

// UNDER CONSTRUCTION
const updateRole = async () => {
  const { id, userInput } = await inquirer.prompt([
    {
      type: "input",
      message: "Which role would you like to edit? Please use ID#",
      name: "id"
    },
    {
      name: "userInput",
      type: "list",
      message: "What would you like to edit?",
      choices: ["TITLE", "SALARY", "DEPARTMENT ID", "GO BACK"]
    }
  ])
  switch (userInput) {
    case "TITLE":
      updateRoleTitle(id)
      break;
    case "SALARY":

      break;
    case "DEPARTMENT ID":

      break;
    default:
      start();
      break;
  }

  const query = connection.query(
    "UPDATE role SET ? WHERE ?",
    [
      {
        title: title
      },
      {
        id: id
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      start();
    }
  );
}

// UNDER CONSTRUCTION
const updateRoleTitle = async (id) => {
  const { title } = await inquirer.prompt([
    {
      type: "input",
      message: "What would you like to change the title to?",
      name: "title"
    }
  ])
  const query = connection.query(
    "UPDATE role SET ? WHERE ?",
    [
      {
        title: title
      },
      {
        id: id
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      start();
    }
  )
}

// UNDER CONSTRUCTION
const updateEmployee = async () => {
  const { id, name } = await inquirer.prompt([
    {
      type: "input",
      message: "Which role would you like to edit? Please use ID#",
      name: "id"
    },
    {
      type: "input",
      message: "What would you like to change the name to?",
      name: "name"
    }
  ])
  const query = connection.query(
    "UPDATE department SET ? WHERE ?",
    [
      {
        name: name
      },
      {
        id: id
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      start();
    }
  );
}

const viewInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to view?",
    choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "GO BACK"]
  })
  switch (userInput) {
    case "DEPARTMENTS":
      connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
      });
      break;
    case "ROLES":
      connection.query("SELECT role.id, role.title, role.salary, department.name, role.department_id FROM role INNER JOIN DEPARTMENT ON role.department_id = department.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
      });
      break;
    case "EMPLOYEES":
      // "SELECT CONCAT(employee.first_name, ' ' , employee.last_name) AS Employee, role.title, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role ON e.role_id=role.id"
      connection.query("SELECT CONCAT(employee.first_name, ' ' ,employee.last_name) AS Employee, employee.manager_id, role.title, role.salary,department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", function (err, res) {
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



// ADD VALIDATES
// validate:(salary)=>{
//   if (isNaN(parseInt(salary))) {
//       console.log('\n Insert a number!')
//       return false
//   }
//   return true
// }