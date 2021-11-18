
const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');

require('dotenv').config();

// connecting to the database using env file;

const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Successfully connected to the tracker_db database!`)
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
          choices: ["View all departments", "View all roles;", "View all employees;", "Add department;", "Add role;", "Add employee;", "Update Employee Role;"]
      }
    ])
    // depending on the selection, invoking a view\add function;
    .then((answers) => {
        if (answers.displayAll === "View all departments"){
            viewAllDepartments();
        };
        if (answers.displayAll === "View all roles;"){
            viewAllRoles();
        };
        if (answers.displayAll === "View all employees;"){
            viewAllEmployees();
        };
        if (answers.displayAll === "Add department;"){
            addDepartment();
        };
        if (answers.displayAll === "Add role;"){
            addRole();
        };
        if (answers.displayAll === "Add employee;"){
          addEmployee();
        };
        if (answers.displayAll === "Update Employee Role;"){
          updateEmployeeRole();
        };
     });
};

// write function for each prompt;

// View all departments from tracker.department table;
function viewAllDepartments(){
    db.query('SELECT * FROM tracker_db.department;', 
    function (err, results) {
      console.table(results);
      mainPrompt();
    });
  };

// View all employees from tracker.employee table;
function viewAllEmployees(){
    db.query('SELECT * FROM tracker_db.employee;', 
    function (err, results) {
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

//   add a new department to the tracker.department table;
function addDepartment(){
    return inquirer.prompt([
        // prompting the user to enter the department name;
        {
            type: "input",
            name: "departmentName",
            message: "Enter the department name!"
        }
      ])
    //   using mysql2 line to insert new department into tracker.department table;
    .then(function (answer) {
    db.query('INSERT INTO department (name) VALUES (?)', [answer.departmentName],
    function (err, results) {
      console.table(results);
      mainPrompt();
    })
})
};

//   add a new role to the tracker.role table;
function addRole(){
    return inquirer.prompt([
        // prompting the user to enter the role name;
        {
            type: "input",
            name: "roleName",
            message: "Enter the role name!"
        }
      ])
    //   using mysql2 line to insert new role into tracker.role table;
    .then(function (answer) {
    db.query('INSERT INTO role (name) VALUES (?)', [answer.roleName],
    function (err, results) {
      console.table(results);
      mainPrompt();
    })
})
};

function addEmployee(){
  return inquirer.prompt([
      // prompting the user to enter the employee name;
      {
          type: "input",
          name: "employeeName",
          message: "Enter the employee name!"
      }
    ])
  //   using mysql2 line to insert new employee into tracker.employee table;
  .then(function (answer) {
  db.query('INSERT INTO employee (name) VALUES (?)', [answer.employeeName],
  function (err, results) {
    console.table(results);
    mainPrompt();
  })
})
};