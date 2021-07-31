import inquirer from 'inquirer';
import { Choices } from '../utils/Choices.js'
export default class TUI { // stands for Terminal User Interface, this is where I'll create my UI using inquirer.

   public async Menu() {
    const  generate = await inquirer.prompt({
      message: '⌨ What do you want to do? ',
      type: 'list',
      name: 'OptionSelected',
      choices: Object.values(Choices)
    });
     console.log(generate['OptionSelected']);
  }
}
const aa = new TUI();
const response = await aa.Menu()