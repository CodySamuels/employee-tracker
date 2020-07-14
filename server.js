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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
//   readEntry();
});

// 
// =======================================================

function addEmployee(first_name, last_name, role_id, manager_id) {
//   console.log("Inserting a new entry...\n");
  var query = connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: first_name,
      last_name: last_name,
      role_id: role_id,
      manager_id: manager_id,
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Employee added!\n");
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function addRole(title, salary, department_id) {
    //   console.log("Inserting a new entry...\n");
      var query = connection.query(
        "INSERT INTO role SET ?",
        {
          title: title,
          salary: salary,
          department_id: department_id,
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " Role added!\n");
        }
      );
    
      // logs the actual query being run
      console.log(query.sql);
    }

function addDepartment(name) {
    //   console.log("Inserting a new entry...\n");
      var query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: name,
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " Department added!\n");
        }
      );
    
      // logs the actual query being run
      console.log(query.sql);
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
  connection.query("SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", function(err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
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
addRole("Sales Associate", 2, 1)
addEmployee("Testing", "Doe", 2, 1)
readEntry()