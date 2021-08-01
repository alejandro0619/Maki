import inquirer from 'inquirer';
import { Choices } from '../utils/Menu_choices.js';
import Password from './gen_pass.js';
const password = new Password();
import { parseToNumber } from '../utils/parse_to_number.js';
export default class TUI { // stands for Terminal User Interface, this is where I'll create my UI using inquirer.

   public async Menu() {
    const menu = await inquirer.prompt({
      message: 'What do you want to do? ',
      type: 'list',
      name: 'OptionSelected',
      choices: Object.values(Choices)
    });
     switch (menu['OptionSelected']) {
       case Choices.generate:
         this.generateView()
         break;
       case Choices.save:
         
         break;
       case Choices.edit:

         break;
       case Choices.view:

         break;
       case Choices.delete:

         break;
     }
  }
  private async generateView() {
    const generateOptions = await inquirer.prompt({
      message: 'How much long you want your password to be?',
      name: 'length',
      type: 'input',
    });
    const pswdLength = parseToNumber(generateOptions['length']);
    if (isNaN(pswdLength)) {
      console.log(`Please enter a number.`);
      this.generateView();
    } else {
      console.log(pswdLength);
    }
  }
}
const aa = new TUI();
const response = await aa.Menu()