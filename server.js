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
  readEntry();
});



// 
// =======================================================

// function createEntry(item,category,bid) {
// //   console.log("Inserting a new entry...\n");
//   var query = connection.query(
//     "INSERT INTO item SET ?",
//     {
//       title: title,
//       artist: artist,
//       genre: genre,
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " entry inserted!\n");
//       // Call updateProduct AFTER the INSERT completes
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

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
// SELECT title, firstName, lastName
// FROM books
// LEFT JOIN authors ON books.authorId = authors.id;



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

// askUser()
// createEntry("Enjoy the Silence", "Depeche Mode", "Rock");
// updateEntry();
// deleteEntry();
// readEntry();