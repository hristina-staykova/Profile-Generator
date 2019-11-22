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
    choices: ["blue", "green", "orange", "gray"]
  }
];

function callback(err) {
  if (err) throw err;
}

function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, callback);
  console.log("The file has been saved!");
}

function init() {
  inquirer.prompt([questions[0], questions[1]]).then(answers => {
    var username = answers.github_username;
    const GITHUB = `https://api.github.com/users/${username}`;
    axios.get(GITHUB).then(response => {
      var userUrl = response.data.html_url;
      var profilePicture = response.data.avatar_url;
      var followers = parseInt(response.data.followers);
      var publicRepos = parseInt(response.data.public_repos);
      var following = parseInt(response.data.following);
      var location = response.data.location;
      var userBio = response.data.bio;
      var userBlog = response.data.blog;
      console.log(html.generateHTML(answers));
      let data = html.generateHTML(answers);
      writeToFile(username + ".html", data);
    });
  });
}

init();
