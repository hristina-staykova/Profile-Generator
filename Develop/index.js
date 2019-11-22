const inquirer = require("inquirer");
const convertHTMLToPDF = require("pdf-puppeteer");
const axios = require("axios");
const fs = require("fs");
const html = require("./generateHTML.js");

const questions = [
  {
    type: "input",
    name: "github_username",
    message: "What is your Github username ?"
  },
  {
    name: "color",
    type: "list",
    message: "Choose a color",
    choices: ["blue", "green", "pink", "red"]
  }
];

var callback = function(err) {
  if (err) throw err;
};

function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, callback);
  console.log("The file has been saved!");
}

function init() {
  inquirer.prompt([questions[0], questions[1]]).then(answers => {
    var username = answers.github_username;
    console.log(username);
    const GITHUB = `https://api.github.com/users/${username}`;
    axios.get(GITHUB).then(response => {
      console.log(response);
      let data = html.generateHTML(answers, response.data);
      let fileName = username + ".html";
      writeToFile(fileName, data);
      // convertHTMLToPDF(fileName, callback);
    });
  });
}

init();
