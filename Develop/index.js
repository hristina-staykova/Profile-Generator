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

var errorFn = function(err) {
  if (err) throw err;
};

function writeToPDF(data, username) {
  convertHTMLToPDF(
    data,
    pdf => {
      fs.writeFile(`${username}.pdf`, pdf, errorFn);
    },
    { format: "A4", pageRanges: "1" }
  );
}

async function init() {
  const answers = await inquirer.prompt([questions[0], questions[1]]);
  var username = answers.github_username;
  const githubUrl = `https://api.github.com/users/${username}`;
  let response;
  let starsCount;
  try {
    response = await axios.get(githubUrl);
    let starsList = await axios.get(githubUrl + "/starred");
    starsCount = starsList.data.length;
  } catch (e) {
    if (e.response.status === 404) {
      console.log("User: '" + username + "' not found");
      return;
    }
    throw e;
  }
  let htmlOutput = html.generateHTML(answers, response.data, starsCount);
  writeToPDF(htmlOutput, username);
}

init();
