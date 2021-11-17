
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

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