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
    },{
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
      manager_id : manager_id,
    },
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      console.log(`The ${first_name} ${last_name} has been added!\n`);
      start();
    }
  );
}

const addRole = async () => {
  const { role_title, role_salary, department_id } = await inquirer.prompt([
    {
    type: "input",
    message: "What would you like to name the new role?",
    name: "role_title"
    },
    {
      type: "input",
      message: "What is this role's salary?",
      name: "role_salary"
    },
    {
      type: "input",
      message: "Which department would you like to add it to? Please use the department ID",
      name: "department_id"
    },
  ])
  const query = connection.query(
    "INSERT INTO role SET ?",
    {
      title: role_title,
      salary: role_salary,
      department_id : department_id,
    },
    function (err, res) {
      if (err) throw err;
      console.log("====================================================================")
      console.log(`The ${role_title} role has been added!\n`);
      start();
    }
  );
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

// function updateProduct() {
//     console.log("Updating bid...\n");
//     var query = connection.query(
//       "UPDATE  SET ? WHERE ?",
//       [
//         {
//           quantity: 100
//         },
//         {
//           flavor: "Rocky Road"
//         }
//       ],
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " products updated!\n");
//         // Call deleteProduct AFTER the UPDATE completes
//         deleteProduct();
//       }
//     );


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

function readEntry() {
  console.log("Selecting all entries...\n");
  connection.query("SELECT employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary,department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}


// function askUser(){
//   inquirer.prompt({

//     type:"list",
//     message :"What to do?",
//     choices : ["create", "read", "quit"],
//     name:"userchoice"

//   }).then(function(answers){

//     if(answers.userchoice ==="read"){
//       readEntry();
//     } else if (answers.userchoice ==="create"){
//       createEntry()
//     } else {
//       console.log('goodbye');
//       connection.end();
//     }
//   })
// }

// addDepartment("Sales")
// addRole("Sales Associate", 2, 1)
// addEmployee("Testing", "Doe", 2, 1)
// readEntry()

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
      readEntry()
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

const editInquirer = async () => {
  const { userInput } = await inquirer.prompt({
    name: "userInput",
    type: "list",
    message: "What would you like to edit?",
    choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "GO BACK"]
  })
  switch (userInput) {
    case "DEPARTMENT":
      console.log("DEPARTMENT")
      start()
      break;
    case "ROLE":
      console.log("ROLE")
      start()
      break;
    case "EMPLOYEE":
      console.log("EMPLOYEE")
      start()
      break;
    default:
      start();
      // connection.end();
      break;
  }
}

// const viewInquirer = async () => {
//   const { userInput } = await inquirer.prompt({
//     name: "userInput",
//     type: "list",
//     message: "What would you like to add?",
//     choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "GO BACK"]
//   })
//   switch (userInput) {
//     case "DEPARTMENT":
//       // console.log("ADD")
//       addInquirer()
//       break;
//     case "ROLE":
//       // console.log("EDIT")
//       connection.end();
//       break;
//     case "EMPLOYEE":
//       // console.log("VIEW")
//       connection.end();
//       break;
//     default:
//       start();
//       // connection.end();
//       break;
//   }
// }