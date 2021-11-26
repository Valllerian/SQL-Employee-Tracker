
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
          // work on "View employees by manager", "View employees by department","Get budget", "Delete","Update employee manager";
          choices: ["View all departments", "Add department;", "View all roles;", "Add role;",  "View all employees;", "Add employee;", "Get budget", "Delete", "Update employee role;", "Exit"]
      }
    ])
    // depending on the selection, invoking a view\add function;
    .then((answers) => {
        if (answers.displayAll === "View all departments"){
            viewAllDepartments();
        };
        // if (answers.displayAll === "View employees by manager"){
        //   viewEmployeeByManager();
        // };
        // if (answers.displayAll === "View employees by department"){
        //   viewEmployeeByDepartment();
        // };
        // if (answers.displayAll === "Update employee manager"){
        //   updateEmployeeManager();
        // };
        if (answers.displayAll === "Delete"){
          Delete();
        };
        if (answers.displayAll === "Get budget"){
          getBudget();
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
        if (answers.displayAll === "Exit"){
          exit();
        };
     });
};

// write function for each prompt;

// View all departments from tracker.department table;
function viewAllDepartments(){
    db.query('SELECT * FROM tracker_db.department;', 
    function (err, results) {
      console.table(results);
      if(err){
        console.log(err);
      }; 
      mainPrompt();
    });
  };

// View all employees from tracker.employee table;
function viewAllEmployees(){
    db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id' , 
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
    db.query("SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;", 
    function (err, results) {
      console.table(results);
      if(err){
        console.log(err);
      };
      mainPrompt();
    });
  };

  // Bonus:
//  function viewEmployeeByDepartment();
//  function viewEmployeeByManager();
//  function updateEmployeeManager();

 function getBudget(){
   db.query("SELECT * FROM tracker_db.department;", 
   function(err, results){
   let departments = [];
   results.forEach(result => departments.push({name: result.name, value: result.id}));
   return inquirer.prompt([
    {
        type: "list",
        name: "departmentSelect",
        message: "Select a department!",
        choices: departments
    },
    ]).then(function(answer){
    let departmentId = answer.departmentSelect;
    db.query('SELECT SUM(roles.salary) AS department_budget from employee JOIN roles ON employee.role_id = roles.id WHERE roles.department_id = ?', [departmentId], 
    function (err, results) {
      if(err){
        console.log(err);
      };
      console.table(results)
      exitPrompt(); ;
    });
    });
   });
 };

// exit prompt to let the user an ability to finish the process;
function exitPrompt() {
  let responses = ["Yes", "No"]
  return inquirer.prompt([
    {
        type: "list",
        name: "response",
        message: "Would you like to go back to main menu?",
        choices: responses
    },
]).then (function(answer){
  if( answer.response === "Yes"){
    mainPrompt();
  };
  if( answer.response === "No"){
    console.log("Goodbye!")
    process.exit();
  };
})
}

// adding a delete prompt;
 function Delete(){
   let deleteOptions = ["Role", "Department", "Employee" ];
   return inquirer.prompt([
    // prompting the user to enter the delete info;
    {
        type: "list",
        name: "deleteChoice",
        message: "Select what you want to delete!",
        choices: deleteOptions
    }
  ]).then (function (answer){
    if( answer.deleteChoice === "Role"){
      deleteRole();
    };
    if( answer.deleteChoice === "Department"){
      deleteDepartment();
    };
    if( answer.deleteChoice === "Employee"){
      deleteEmployee();
    };
    
  })
 };

//  deleting Role;
 function deleteRole(){
  //  select all from roles table;
  db.query('SELECT * FROM tracker_db.roles;',  
  function (err, results){
  let roles = [];
  results.forEach(result => roles.push({name: result.title, value: result.id}));
    return inquirer.prompt([
      {
          type: "list",
          name: "deletedRole",
          message: "Select the role!",
          choices: roles
      },
    ]).then(function (answer)  {
    let role = answer.deleteRole;
    // deleting selected role from roles;
    db.query('DELETE FROM roles WHERE id = ?', [role], 
    function (err, results) {
      if(err){
          console.log(err);
      };
          console.log("Role has been deleted!");
          exitPrompt();
      });
  });
  });
};

  // deleting Employee
 function deleteEmployee(){
   //  select all from employee table;
  db.query('SELECT * FROM tracker_db.employee;', 
  function (err, results) {
  let employees = [];
  results.forEach(result => employees.push({name: result.first_name + ' ' + result.last_name, value: result.id}));
  return inquirer.prompt([
      {
          type: "list",
          name: "deleteEmployee",
          message: "Select an employee to delete!",
          choices: employees
      },
  ])
  .then(function (answer)  {
  let deletedEmployee = answer.deleteEmployee;

  // deleting selected employee from roles;
  db.query('DELETE FROM tracker_db.employee WHERE id = ?', [deletedEmployee], 
  function (err, results) {
      if(err){
          console.log(err);
      };
          console.log("Employee was successfully deleted!");
          exitPrompt();
      
      });
  });
  });
 };

//  deleting department;
function deleteDepartment(){
  //  select all from department table;
  db.query("SELECT * FROM tracker_db.department;", 
  function (err, results)  {
  let departments = [];
  results.forEach(result => departments.push({name: result.name, value: result.id}));
  return inquirer.prompt([
      {
          type: "list",
          name: "deletedDepartment",
          message: 'Which department would you like to delete?',
          choices: departments
      },
      ]).then(function(answer) { 
  let departmentId = answer.deletedDepartment;
  // deleting selected department from roles;
  db.query('DELETE FROM department WHERE id = ?', [departmentId], 
  function (err, results)  {
      if(err){
        console.log(err);
      };
      console.log(`Department has been deleted!`)
        exitPrompt(); 
      });
  });
  });
};

//   add a new department to the tracker.department table;
function addDepartment(){
    return inquirer.prompt([
        // prompting the user to enter the department info;
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
      console.log(`${answer.departmentName} has been added to the department list.`);
      if(err){
        console.log(err);
      };
      mainPrompt();
    })
})
};

//   add a new role to the tracker.role table;
function addRole(){
  db.query('SELECT * FROM tracker_db.department;', 
  function (err, results) {
    let departments = [];
    results.forEach(results => departments.push({name: results.name, value: results.id})); 
    return inquirer.prompt([
        // prompting the user to enter the role info;
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
          type: "list",
          name: "roleDepartment",
          message:"Select department for the new role.",
          choices: departments
      }
      ])
    //   using mysql2 line to insert new role into tracker.role table;
    .then(function (answers) {
    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleTitle, answers.roleSalary, answers.roleDepartment],
    function (err, results) {
      console.log(`${answers.roleTitle} has been added to the role list.`);
      if(err){
        console.log(err);
      };
      mainPrompt();
    });
  });
});
};

function addEmployee(){
  db.query('SELECT * FROM tracker_db.roles;', 
  function (err, results) {
    let roles = [];
    results.forEach(results => roles.push({name: results.title, value: results.id})); 
    return inquirer.prompt([
      // prompting the user to enter the employee info;
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
        type: "list",
        name: "employeeRole",
        message: "Select the role !",
        choices: roles
      }
    ])
   
  .then(function (answers) {
    // saving new employee info;
      let newName = answers.employeeName;
      let newLastName = answers.employeeLastName;
      let newRole = answers.employeeRole;
    // Selecting all employees to input a manager;
  db.query('SELECT * FROM tracker_db.employee;', 
  function (err, results) {
      let employeeName = [];
      results.forEach(result => employeeName.push({ name: result.first_name + ' ' + result.last_name, value: result.id}));
    // a prompt for a manager selection;
  return inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Select the manager.",
        choices: employeeName
      },
  ])

  .then(function (answers)  {
    // saving a manager;
  let manager = answers.manager;
    // Inserting new employee to the database;
  db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [newName, newLastName, newRole, manager], 
      function (err, results) {
        console.log(`${newName} has been added to the employee list.`);
        if(err){
          console.log(err);
        };
        mainPrompt()
      });
  });
  });
  });
});
};

function updateEmployeeRole(){
// Selecting all employees;
  db.query('SELECT * FROM tracker_db.employee;', 
  function (err, results) {
let staff = [];
  results.forEach(results => staff.push({name: results.first_name})); 
  return inquirer.prompt([
    {
      type: "list",
      name: "employeeName",
      message: "Select an employee.",
      // returning an array with all employees;
      choices: staff
    },
  ])
  .then(function (answer)  {
  let employeeName = answer.employeeName;
  // selecting all roles;
  db.query('SELECT * FROM tracker_db.roles;', 
  function (err, results) {
let roles = [];
  results.forEach(results => roles.push({name: results.title, value: results.id}));
    return inquirer.prompt([
    {
      type: "list",
      name: "updateRole",
      message: "Select employees new role!",
      // returning all roles;
      choices: roles
    },
  ])
  .then(function (answer) {
    let roleName = answer.updateRole; 
    // setting a new role for an employee;
    db.query('UPDATE tracker_db.employee SET role_id = ? WHERE first_name = ?', [roleName, employeeName], 
    function (err, results) {
      console.log(`${employeeName}'s role has been updated`);
      if(err){
        console.log(err);
      }; 
      mainPrompt();
    });
  });
});
});
});
};


function exit(){
  console.log("Goodbye!");
  // https://www.codegrepper.com/code-examples/javascript/kill+process+node+js
  // how to kill process;
  // or process.exit();
  process.kill(process.pid, 'SIGINT');
}