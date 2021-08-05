import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { Choices } from '../utils/Menu_choices.js';
import Password from './password.js';
import DbService from './database.js';
import { scrtpsp } from '../scrtpsp/scrtpsp.js'
const password: Password = new Password();
import { parseToNumber } from '../utils/parse_to_number.js';
import { pswdSchema } from '../db/pswd_Item.js';
export default class TUI { // stands for Terminal User Interface, this is where I'll create my UI using inquirer.
  
  private async secret() {
    const secret = await inquirer.prompt({
      message: 'Enter a security phrase (this will encrypt and decrypt all your password,don\'t forget it)',
      name: 'secret',
      type: 'password',
    });
    scrtpsp.psp = secret['secret'];
  }
  // sets thefielf db after the assignment of secretpsp
  private db = new DbService(scrtpsp.psp);
   public async Menu() {
    const menu = await inquirer.prompt({
      message: 'What do you want to do? ',
      type: 'list',
      name: 'OptionSelected',
      choices: Object.values(Choices)
    });
     
     switch (menu['OptionSelected']) {
       case Choices.generate:
         this.generateView();
         break;
       case Choices.create:
         
         break;
       case Choices.edit:

         break;
       case Choices.view:

         break;
       case Choices.delete:

         break;
     }
  }
  private async confirmToSave(): Promise<boolean>{
    const confirm = await inquirer.prompt({
      message: 'Do you want to save it?',
      name: 'confirmation',
      type: 'confirm',
    });
    switch (confirm['confirmation']) {
      case true:
        return true;
      case false:
        return false;
      default:
        return false;
    }
  }
  private async save(pswd: pswdSchema, confirmation: boolean) {
    if (confirmation) {
      this.db.addPassword(pswd)
    }
  }
  private async parseToSave(pswd: string): Promise<pswdSchema> {
    const titleOfThePassword = await inquirer.prompt({
      message: 'Where are yoy going to use this? (We don\'t collect information but to save the database)',
      name: 'title',
      type: 'input',
    });
    return {
      title: titleOfThePassword['title'],
      pswd: pswd
    }
  }
  private async generateView() {
    const generateOptions = await inquirer.prompt({
      message: 'How much long you want your password to be?',
      name: 'length',
      type: 'input',
    });
    const pswdLength: number = parseToNumber(generateOptions['length']);
    if (isNaN(pswdLength)) {
      console.log(`Please enter a number.`);
      return this.generateView();
    } else {

      const pswdGenerated: string = password.generatePassword(pswdLength);
      await clipboardy.write(pswdGenerated);
      console.log(`Your password: ${chalk`{green ${pswdGenerated} }`} is copied on the clipboard!`);
      const confirmation: boolean = await this.confirmToSave();
      const parsed: pswdSchema  = await this.parseToSave(pswdGenerated);
      await this.secret();
      await this.save(parsed, confirmation);
      
    }
  }
}
const aa = new TUI();
const response = await aa.Menu()