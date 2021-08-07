import inquirer from 'inquirer';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { Choices } from '../utils/Menu_choices.js';
import Password from './password.js';
import DbService from './database.js';
import { parseToNumber } from '../utils/parse_to_number.js';
import { pswdSchema } from '../db/pswd_Item.js';
import Hash from '../helper/hash_passphrase.js';
import GetPassPhrase from '../helper/read_file.js';
import Check from '../helper/check_first_time.js';
const passphrase: GetPassPhrase = new GetPassPhrase();
const password: Password = new Password();
const check: Check = new Check();
const hash: Hash = new Hash();

export default class CLIInterface { // * This is where I'll create my UI using inquirer.
  
  private async setUserPassphrase(): Promise<boolean> {
    // set user passphrase when he execute the application for the first time
    const userState: boolean = await check.check();
    if (userState) {
      const secret: string = await this.secret();
      const hashed = hash.hashPassPhrase(secret);
      passphrase.write(hashed);
      return true
    } else {
      const psp: string = await passphrase.read();
      const secret: string = await this.secret();
      if (hash.compare(psp, secret)) {
        return true;
      } else {
        return false
      }
      
    }
  }
  private async secret(): Promise<string> {
    const secret = await inquirer.prompt({
      message: 'Enter your security phrase',
      name: 'secret',
      type: 'password',
    });
    return hash.hashPassPhrase(secret['secret']);
    
  }
  // sets the field db after the assignment of secretpsp
  private db = new DbService(passphrase.read());

  public async MenuView() { // execute this function to se the user passphrase
    const userIsAuth: boolean = await this.setUserPassphrase();
    if (!userIsAuth) {
      console.log('Please enter the correct passphrase to access to your passwords.');
      await this.MenuView();
    } else {
      console.clear();
      const menu = await inquirer.prompt({
        message: 'What do you want to do? ',
        type: 'list',
        name: 'OptionSelected',
        choices: Object.values(Choices)
      });
       
       switch (menu['OptionSelected']) {
         case Choices.generate:
           await this.generateView(); //generate random passwords
           break;
         case Choices.create:
          
           break;
         
         case Choices.edit:
           await this.editPasswords(); // edit password
           break;
         
         case Choices.view:
            this.getAllPasswordView(); // get all passwords
           break;
         
         case Choices.search: 
         console.log('a')
           await this.getSinglePasswordView(); // get password by title
           break;
         
         case Choices.delete:
  
           break;
       }
    }
  }
  private async editPasswords() {
    const titleOfThePassword = await inquirer.prompt({
      message: 'Title:',
      name: 'title',
      type: 'input',
    });
    const newPassword = await inquirer.prompt({
      message: 'New password:',
      name: 'password',
      type: 'password',
    });
    await this.db.editPassword(titleOfThePassword['title'], password.encrypt(newPassword['password'], await passphrase.read()));
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
      message: 'Where are you going to use this? (We don\'t collect information but to save the database)',
      name: 'title',
      type: 'input',
    });
    return {
      title: titleOfThePassword['title'],
      pswd: pswd
    }
  }
/*
 * All CLI views right bellow
  ? (btw I think I should stop implementing a lot of methods in this file to avoid complexity (more than the autogenerated by my spaghetti code))
 */
  private async getAllPasswordView(): Promise<void> {

    console.log(await this.db.getAllPassword());
  }

  private async getSinglePasswordView(): Promise<void> {
    console.log('antes del prompt')
    const title = await inquirer.prompt({
      message: 'Tile',
      name: 'password',
      type: 'input',
    });
    console.log('despues del promptantes de la busqueda')
    console.log(await this.db.getPasswordByTitle(title['password']));

  }
  private async generateView(): Promise<void> {
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
      await this.save(parsed, confirmation);
      console.log('saved');
    }
  }
}
const aa = new CLIInterface();
const response = await aa.MenuView()