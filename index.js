
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

// connecting to the database using env file;

const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  );

  db.connect( (err) => {
    if (err){
      throw error;
    }
  });


// main inquirer function:

mainPrompt();

function mainPrompt() {
    // prompting a user to select a choice: 
    return inquirer.prompt([
      {
          type: "list",
          name: "displayAll",
          message: "Hello! Please, select what you would to do.",
          choices: ["View all departments", "View all roles", "View all employees", "Add department", "Add role", "Add employee", "Update Employee Role"]
      }
    ])
    // depending on the selection, invoking a view\add function;
    .then((answers) => {
        if (answers.displayOptions === "View all departments"){
            viewAllDepartments();
        };
        if (answers.displayOptions === "View all roles"){
            viewAllRoles();
        };
        if (answers.displayOptions === "View all employees"){
            viewAllEmployees();
        }
     })
};

// write function for each prompt;

// View all departments from tracker.department table;
function viewAllDepartments(){
    db.query('SELECT * FROM tracker_db.department;', function (err, results) {
      console.table(results);
      mainPrompt();
    });
  };

// View all employees from tracker.employee table;
function viewAllEmployees(){
    db.query('SELECT * FROM tracker_db.employee;', function (err, results) {
      console.table(results);
      mainPrompt();
    });
  };

// View all roles from tracker.role table;
function viewAllRoles(){
    db.query('SELECT * FROM tracker_db.role;', 
    function (err, results) {
      console.table(results);
      mainPrompt();
    });
  };