const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'title',
            message: 'Which of the following describes your job title?',
            choices: ["Manager", "Engineer", "Intern"]
        },

        {
            type: 'input',
            name: 'name',
            message: 'What is your name?',
        },
        {
            type: 'input',
            name: 'email',
            message: 'What is your email?',
        },
        {
            type: "input",
            name: "id",
            message: 'What is your ID number?',
        },
        {
            type: "input",
            name: "officeNumber",
            message: 'What is your office number?',
            when: function (answers) {
                return answers.title === "Manager";
            }
        },
        {
            type: "input",
            name: "github",
            message: 'What is your GitHub username?',
            when: function (answers) {
                return answers.title === "Engineer";
            },

        },
        {
            type: "input",
            name: "school",
            message: 'What is the name of your school?',
            when: function (answers) {
                return answers.title === "Intern";
            },

        },
        {
            type: 'list',
            message: "Would you like to add another employee?",
            name: 'addEmployee',
            choices: ['yes', 'no']
        }

    ])
    .then((data) => {

        // Check the employee type
        switch (data.title) {
            // Constuct the class for that type (Manager, Eng, Intern)
            // Add constructed employee class to team array
            case 'Manager':
                const newManager = new Manager(data.name, data.id, data.email, data.officeNumber);
                employees.push(newManager);
                break;

            case 'Engineer':
                const newEngineer = new Engineer(data.name, data.id, data.email, data.github);
                employees.push(newEngineer);
                break;

            case 'Intern':
                const newIntern = new Intern(data.name, data.id, data.email, data.school);
                employees.push(newIntern);
                break;
        }

        // Check the value of the 'add employee' question.
        // if yes, run questions again
        if (data.addEmployee === 'yes') {
            addEmployee();
        }
        else {
            renderTeam();
        }
    });
}

const renderTeam = () => {
    const team = render(employees);
    fs.writeFile(outputPath, team, (err) =>
    err ? console.log(err) : console.log("Success!"));
}
addEmployee();
