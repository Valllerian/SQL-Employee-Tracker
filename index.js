
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
    db.query('SELECT id, first_name, last_name FROM tracker_db.employee;', 
    function (err, results) {
      console.table(results);
      if(err){
        console.log(err);
      };
      mainPrompt();
    });
  };

// View all roles from tracker.role table;
function viewAllRoles(){
    db.query("SELECT id, title, salary, department_id FROM tracker_db.roles;", function (err, results) {
      console.table(results);
      if(err){
        console.log(err);
      };
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
      if(err){
        console.log(err);
      };
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
            name: "roleTitle",
            message: "Enter the role title!"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Enter the role salary! (DECIMAL input)"
        },
        {
          type: "input",
          name: "roleDepartment",
          message: "Enter the role department! (Reference Department ID)"
      }
      ])
    //   using mysql2 line to insert new role into tracker.role table;
    .then(function (answers) {
    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleTitle, answers.roleSalary, answers.roleDepartment],
    function (err, results) {
      console.log(`${answers.roleTitle} has been added to the list.`);
      if(err){
        console.log(err);
      };
      mainPrompt();
    });
});
};

function addEmployee(){
  return inquirer.prompt([
      // prompting the user to enter the employee name;
      {
          type: "input",
          name: "employeeName",
          message: "Enter the employee name!"
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "Enter the employee last name!"
      },
      {
        type: "input",
        name: "employeeRole",
        message: "Enter the role id name!"
      },
      {
        type: "input",
        name: "employeeManager",
        message: "Enter the employee manager name!"
      }
    ])
  //   using mysql2 line to insert new employee into tracker.employee table;
  .then(function (answers) {
    db.query('INSERT INTO employee (first_name, last_name, role_id,manager_id) VALUES (?, ?, ?, ?)', [answers.employeeName, answers.employeeLastName, answers.employeeRole, answers.employeeManager],
    function (err, results) {
      console.log(`${answers.employeeName} has been added to the list.`);
      if(err){
        console.log(err);
      };
      mainPrompt();
    });
});
};