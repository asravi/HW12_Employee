const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "Surya#86avi",

    database: "company_DB",

});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    begin();
  });

function begin() {
    inquirer.prompt({
        message: "what would you like to do?",
        type: "list",
        choices: [
            "View all Employees",
            "View all Departments",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Role",
            "Exit"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch (answers.choice) {
            case "View all Employees":
                viewEmployees()
                break;

            case "View all Departments":
                viewDepartments()
                break;

            case "Add Employee":
                addEmployee()
                break;

            case "Add Department":
                addDepartment()
                break;

            case "Add Role":
                addRole()
                break;

            case "Update Role":
                updateEmployeeRole();
                break;

            default:
                connection.end()
                break;
        }
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        console.table(data);
        begin();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        begin();
    })
}

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "number",
            name: "roleId",
            message: "What is the employees role ID"
        },
        {
            type: "number",
            name: "managerId",
            message: "What is the employees manager's ID?"
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function(err, data) {
            if (err) throw err;
            console.table("Successfully Inserted");
            begin();
        })
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the department that you want to add?"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department_id], function(err, data) {
            if (err) throw err;
            console.table("Successfully Inserted");
            begin();
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            console.table(data);
        })
        begin();
    })

}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            message: "which employee would you like to update? (use first name only for now)",
            type: "input",
            name: "name"
        }, {
            message: "enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name], function (err, data) {
            console.table(data);
        })
        begin();
    })

}
