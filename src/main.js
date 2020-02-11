import inquirer from "inquirer";

export default () => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "What's your name?"
    }
  ];

  inquirer.prompt(questions).then(answers => {
    console.log(`Hi ${answers["name"]}!`);
  });
};
